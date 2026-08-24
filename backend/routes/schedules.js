const express = require('express');
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const schedules = await Schedule.find({ active: true }).sort({ title: 1 });
  res.json({ success: true, data: schedules });
});

router.get('/all', auth, async (req, res) => {
  const schedules = await Schedule.find().sort({ createdAt: -1 });
  res.json({ success: true, data: schedules });
});

router.post('/', auth, async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not create schedule' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).catch(() => null);
  if (!schedule) return res.status(404).json({ success: false, error: 'Schedule not found' });
  res.json({ success: true, data: schedule });
});

router.delete('/:id', auth, async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id).catch(() => null);
  if (!schedule) return res.status(404).json({ success: false, error: 'Schedule not found' });
  res.json({ success: true, message: 'Schedule deleted' });
});

module.exports = router;
