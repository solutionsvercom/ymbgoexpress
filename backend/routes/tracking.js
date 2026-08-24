const express = require('express');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const buses = await Bus.find({ active: true }).sort({ busId: 1 });
  res.json({ success: true, data: buses });
});

router.get('/all', auth, async (req, res) => {
  const buses = await Bus.find().sort({ busId: 1 });
  res.json({ success: true, data: buses });
});

router.get('/:bookingId', async (req, res) => {
  const key = String(req.params.bookingId || '').trim();
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let bus = await Bus.findOne({ busId: { $regex: `^${escaped}$`, $options: 'i' } });

  if (!bus) {
    const booking = await Booking.findOne({ bookingId: { $regex: `^${escaped}$`, $options: 'i' } });
    if (booking?.busId) {
      bus = await Bus.findOne({ busId: booking.busId });
    }
    if (!booking && !bus) {
      return res.status(404).json({ success: false, error: 'Bus not found for this booking' });
    }
    if (!bus) {
      bus = await Bus.findOne({ active: true }).sort({ busId: 1 });
    }
    if (!bus) {
      return res.status(404).json({ success: false, error: 'No active buses to track' });
    }
    return res.json({
      success: true,
      data: {
        ...bus.toObject(),
        bookingId: booking?.bookingId || key,
        passenger: booking?.name || null
      }
    });
  }

  res.json({ success: true, data: bus });
});

router.post('/', auth, async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not create bus' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const allowed = ['route', 'currentCity', 'nextCity', 'eta', 'lat', 'lng', 'progress', 'cities', 'active', 'busId'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const bus = await Bus.findOneAndUpdate(
    { $or: [{ _id: req.params.id }, { busId: req.params.id }] },
    updates,
    { new: true, runValidators: true }
  ).catch(() => null);

  if (!bus) return res.status(404).json({ success: false, error: 'Bus not found' });
  res.json({ success: true, data: bus });
});

router.delete('/:id', auth, async (req, res) => {
  const bus = await Bus.findOneAndDelete(
    { $or: [{ _id: req.params.id }, { busId: req.params.id }] }
  ).catch(() => null);
  if (!bus) return res.status(404).json({ success: false, error: 'Bus not found' });
  res.json({ success: true, message: 'Bus deleted' });
});

module.exports = router;
