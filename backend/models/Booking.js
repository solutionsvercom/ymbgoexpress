const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    busType: { type: String, required: true, enum: ['seater', 'sleeper'] },
    seats: { type: [String], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    routeFrom: { type: String, default: '' },
    routeTo: { type: String, default: '' },
    busId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    }
  },
  { timestamps: true }
);

bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1, busType: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
