const mongoose = require('mongoose');

const fleetBusSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    registrationNo: { type: String, default: '', trim: true },
    name: { type: String, default: '', trim: true },
    type: { type: String, default: 'AC Sleeper' },
    totalSeats: { type: Number, default: 32, min: 1 },
    status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', default: null },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FleetBus', fleetBusSchema);
