const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const contactMsg = await Contact.create({ name, phone, message });
    console.log(`📩 New lead from ${name} (${phone})`);
    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you within 24 hours.',
      data: { id: contactMsg._id }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not send message' });
  }
});

router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const messages = await Contact.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
});

router.patch('/:id', auth, async (req, res) => {
  const allowed = ['status', 'notes'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const lead = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

router.delete('/:id', auth, async (req, res) => {
  const lead = await Contact.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
});

module.exports = router;
