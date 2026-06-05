const company = {
  name: 'YMB GoExpress',
  contactEmail: process.env.CONTACT_REPLY_TO || process.env.CONTACT_TO || 'ymbgoexpress@gmail.com',
  contactPhone: '+91 97551 24554',
  website: 'https://ymbgoexpress.com',
  role: 'Customer Support Team',
};

const subjects = {
  ownerNotification: 'New Contact Message from {name}',
  userAutoResponse: 'Thank you for contacting {companyName}',
};

const defaults = {
  subjectFallback: 'General Inquiry',
  expectedResponseTime: '24-48 hours',
};

const templates = {
  autoResponseHtml: ({ name, subject, expectedResponse, company: c }) => `
    <p>Dear ${name},</p>
    <p>
      Thank you for reaching out. We received your message regarding "<strong>${subject}</strong>"
      and appreciate you taking the time to contact us.
    </p>
    <p>
      Our team will review your inquiry and get back to you within <strong>${expectedResponse}</strong>.
    </p>
    <p>
      If your request is urgent, feel free to contact us at
      <a href="mailto:${c.contactEmail}">${c.contactEmail}</a> or ${c.contactPhone}.
    </p>
    <p>
      Best regards,<br/>
      ${c.name}<br/>
      ${c.role}<br/>
      ${c.website}
    </p>
    <hr/>
    <p style="font-size:12px;color:#666;">
      This is an automated response. Please do not reply to this email.
    </p>
  `,
  autoResponseText: ({ name, subject, expectedResponse, company: c }) =>
    `Dear ${name},\n\n` +
    `Thank you for reaching out. We received your message regarding "${subject}" and appreciate you contacting us.\n\n` +
    `Our team will review your inquiry and get back to you within ${expectedResponse}.\n\n` +
    `For urgent requests, contact us at ${c.contactEmail} or ${c.contactPhone}.\n\n` +
    `Best regards,\n${c.name}\n${c.role}\n${c.website}\n\n` +
    `---\nThis is an automated response. Please do not reply to this email.`,
};

module.exports = {
  company,
  subjects,
  defaults,
  templates,
};
