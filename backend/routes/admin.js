const express = require('express');
const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  const [leads, unreadLeads, bookings, confirmed, cancelled, revenue, routes, schedules, buses] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'unread' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'cancelled' }),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Route.countDocuments({ active: true }),
    Schedule.countDocuments({ active: true }),
    Bus.countDocuments({ active: true })
  ]);

  const recentLeads = await Contact.find().sort({ createdAt: -1 }).limit(5);
  const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      leads,
      unreadLeads,
      bookings,
      confirmed,
      cancelled,
      revenue: revenue[0]?.total || 0,
      routes,
      schedules,
      buses,
      recentLeads,
      recentBookings
    }
  });
});

module.exports = router;
