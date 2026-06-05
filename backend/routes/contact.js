const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const validator = require('validator');
const { resolveMx } = require('node:dns/promises');
const contactEmailConfig = require('../config/contactEmailConfig');
const { getSmtpConfig, getMailFrom, isSmtpConfigured } = require('../config/smtpConfig');

const router = express.Router();
const messages = [];

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again after a few minutes.',
  },
});

const transporter = nodemailer.createTransport(getSmtpConfig());

function sanitizeText(value = '') {
  return validator.escape(String(value).trim());
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithRetry(payload, retries = 2, retryDelayMs = 800) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await transporter.sendMail(payload);
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await wait(retryDelayMs * (attempt + 1));
      }
    }
  }
  throw lastError;
}

async function hasMxRecord(email) {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    const mx = await resolveMx(domain);
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}

router.post('/', contactLimiter, async (req, res) => {
  const rawName = req.body?.name || '';
  const rawEmail = req.body?.email || '';
  const rawPhone = req.body?.phone || '';
  const rawSubject = req.body?.subject || '';
  const rawMessage = req.body?.message || '';
  const honeypot = req.body?.website || '';

  if (honeypot) {
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  if (!rawName || !rawEmail || !rawPhone || !rawMessage) {
    return res.status(400).json({ success: false, error: 'Name, email, phone and message are required.' });
  }

  if (!validator.isEmail(rawEmail)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  const emailHasMx = await hasMxRecord(rawEmail);
  if (!emailHasMx) {
    return res.status(400).json({ success: false, error: 'Email domain is not accepting emails.' });
  }

  const name = sanitizeText(rawName);
  const email = validator.normalizeEmail(rawEmail) || rawEmail.trim();
  const phone = sanitizeText(rawPhone);
  const subject = sanitizeText(rawSubject) || contactEmailConfig.defaults.subjectFallback;
  const message = sanitizeText(rawMessage);
  const receivedAt = new Date().toISOString();

  if (!isSmtpConfigured()) {
    return res.status(500).json({ success: false, error: 'Email service is not configured on server.' });
  }

  const contactMsg = {
    id: Date.now(),
    name,
    email,
    phone,
    subject,
    message,
    receivedAt,
    status: 'unread',
  };
  messages.push(contactMsg);

  const ownerSubject = contactEmailConfig.subjects.ownerNotification.replace('{name}', name);
  const userSubject = contactEmailConfig.subjects.userAutoResponse.replace('{companyName}', contactEmailConfig.company.name);

  const ownerMail = {
    from: getMailFrom(),
    to: process.env.CONTACT_TO,
    replyTo: email,
    subject: ownerSubject,
    text:
      `New contact form message\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Subject: ${subject}\n` +
      `Message: ${message}\n` +
      `Submitted: ${receivedAt}`,
    html:
      `<h2>New Contact Form Message</h2>` +
      `<p><strong>Name:</strong> ${name}</p>` +
      `<p><strong>Email:</strong> ${email}</p>` +
      `<p><strong>Phone:</strong> ${phone}</p>` +
      `<p><strong>Subject:</strong> ${subject}</p>` +
      `<p><strong>Message:</strong><br/>${message.replaceAll('\n', '<br/>')}</p>` +
      `<p><strong>Submitted:</strong> ${receivedAt}</p>`,
  };

  const expectedResponse = process.env.CONTACT_EXPECTED_RESPONSE_TIME || contactEmailConfig.defaults.expectedResponseTime;
  const userHtml = contactEmailConfig.templates.autoResponseHtml({
    name,
    subject,
    expectedResponse,
    company: contactEmailConfig.company,
  });
  const userText = contactEmailConfig.templates.autoResponseText({
    name,
    subject,
    expectedResponse,
    company: contactEmailConfig.company,
  });

  const userMail = {
    from: getMailFrom(),
    to: email,
    replyTo: process.env.CONTACT_REPLY_TO || process.env.CONTACT_TO,
    subject: userSubject,
    text: userText,
    html: userHtml,
  };

  try {
    await sendWithRetry(ownerMail, 2, 800);
  } catch (err) {
    console.error('Owner notification email failed:', err?.message || err);
    return res.status(502).json({
      success: false,
      error: 'Could not send your message right now. Please try again shortly.',
    });
  }

  try {
    await sendWithRetry(userMail, 2, 800);
  } catch (err) {
    console.error('Auto-response email failed:', err?.message || err);
  }

  return res.status(201).json({
    success: true,
    message: 'Message sent successfully. Please check your email for confirmation.',
  });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: messages });
});

module.exports = router;
