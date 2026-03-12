const express = require('express');
const router = express.Router();

const bookings = [];
let bookingIdCounter = 1000;

router.post('/', (req, res) => {
  const { name, phone, email, busType, seats, totalAmount } = req.body;
  if (!name || !phone || !email || !busType || !seats || seats.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing required booking details' });
  }
  const booking = {
    id: `YMB${++bookingIdCounter}`,
    name, phone, email, busType, seats, totalAmount,
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  };
  bookings.push(booking);
  console.log(`✅ New Booking: ${booking.id} | ${name} | ${seats.join(', ')} | ₹${totalAmount}`);
  res.status(201).json({ success: true, message: 'Booking confirmed!', data: booking });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: bookings });
});

router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking });
});

router.delete('/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Booking not found' });
  bookings[index].status = 'cancelled';
  res.json({ success: true, message: 'Booking cancelled', data: bookings[index] });
});

module.exports = router;
