const mongoose = require('mongoose');

const routeDutySchema = new mongoose.Schema(
  {
    effectiveFrom: { type: String, required: true, trim: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    routeLabel: { type: String, default: '', trim: true },
    fleetBusId: { type: mongoose.Schema.Types.ObjectId, ref: 'FleetBus', default: null },
    busCode: { type: String, default: '', trim: true },
    busName: { type: String, default: '', trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

routeDutySchema.index({ fleetBusId: 1, routeId: 1, effectiveFrom: 1 }, { unique: true });

module.exports = mongoose.model('RouteDuty', routeDutySchema);
