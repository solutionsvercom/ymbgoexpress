const express = require('express');
const router = express.Router();
const messages = [];

router.post('/', (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  const contactMsg = { id: Date.now(), name, phone, message, receivedAt: new Date().toISOString(), status: 'unread' };
  messages.push(contactMsg);
  console.log(`📩 New Contact Message from ${name} (${phone}): ${message}`);
  res.status(201).json({ success: true, message: 'Message received! We will get back to you within 24 hours.' });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: messages });
});

module.exports = router;
