const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Counter = require('../models/Counter');
const Bus = require('../models/Bus');
const auth = require('../middleware/auth');

const router = express.Router();

async function findBooking(id) {
  const booking = await Booking.findOne({ bookingId: id });
  if (booking) return booking;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Booking.findById(id);
  }
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, busType, seats, totalAmount, routeFrom, routeTo } = req.body;
    if (!name || !phone || !email || !busType || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required booking details' });
    }

    const occupied = await Booking.find({
      busType,
      status: 'confirmed',
      seats: { $in: seats }
    }).select('seats');

    const taken = new Set(occupied.flatMap((b) => b.seats));
    const clash = seats.filter((s) => taken.has(s));
    if (clash.length) {
      return res.status(409).json({ success: false, error: `Seats already booked: ${clash.join(', ')}` });
    }

    const seq = await Counter.next('booking');
    const bookingId = `YMB${seq}`;
    const bus = await Bus.findOne({ active: true }).sort({ busId: 1 });

    const booking = await Booking.create({
      bookingId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      busType,
      seats,
      totalAmount: Number(totalAmount) || 0,
      routeFrom: routeFrom || '',
      routeTo: routeTo || '',
      busId: bus?.busId || '',
      status: 'confirmed'
    });

    console.log(`✅ New Booking: ${booking.bookingId} | ${booking.name} | ${booking.seats.join(', ')} | ₹${booking.totalAmount}`);
    res.status(201).json({ success: true, message: 'Booking confirmed!', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Booking failed' });
  }
});

router.get('/occupied', async (req, res) => {
  const { busType } = req.query;
  const filter = { status: 'confirmed' };
  if (busType) filter.busType = busType;
  const bookings = await Booking.find(filter).select('seats');
  const seats = [...new Set(bookings.flatMap((b) => b.seats))];
  res.json({ success: true, data: seats });
});

router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

router.get('/:id', async (req, res) => {
  const booking = await findBooking(req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking });
});

router.patch('/:id', auth, async (req, res) => {
  const allowed = ['status', 'busId', 'routeFrom', 'routeTo'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const existing = await findBooking(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Booking not found' });
  Object.assign(existing, updates);
  await existing.save();
  res.json({ success: true, data: existing });
});

router.delete('/:id', auth, async (req, res) => {
  const existing = await findBooking(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Booking not found' });
  existing.status = 'cancelled';
  await existing.save();
  res.json({ success: true, message: 'Booking cancelled', data: existing });
});

module.exports = router;
