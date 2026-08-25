const mongoose = require('mongoose');

const offlineBookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true },
    passengerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    officeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Office', default: null },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
    fleetBusId: { type: mongoose.Schema.Types.ObjectId, ref: 'FleetBus', default: null },
    routeFrom: { type: String, default: '' },
    routeTo: { type: String, default: '' },
    seats: { type: Number, default: 1, min: 1 },
    amount: { type: Number, default: 0, min: 0 },
    travelDate: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('OfflineBooking', offlineBookingSchema);
