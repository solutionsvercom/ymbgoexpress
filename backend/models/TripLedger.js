const mongoose = require('mongoose');

const otherItemSchema = new mongoose.Schema(
  {
    note: { type: String, default: '', trim: true },
    amount: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const tripLedgerSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, trim: true },
    busCode: { type: String, required: true, trim: true },
    busName: { type: String, default: '', trim: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', default: null },
    routeLabel: { type: String, default: '', trim: true },
    fleetBusId: { type: mongoose.Schema.Types.ObjectId, ref: 'FleetBus', default: null },
    receipts: {
      redbus: { type: Number, default: 0, min: 0 },
      mentis: { type: Number, default: 0, min: 0 },
      indoreOffice: { type: Number, default: 0, min: 0 },
      ujjainOffice: { type: Number, default: 0, min: 0 },
      luggageOffice: { type: Number, default: 0, min: 0 }
    },
    expenses: {
      diesel: { type: Number, default: 0, min: 0 },
      tollBooth: { type: Number, default: 0, min: 0 },
      urea: { type: Number, default: 0, min: 0 },
      otherItems: { type: [otherItemSchema], default: [] }
    }
  },
  { timestamps: true }
);

tripLedgerSchema.index({ date: 1, busCode: 1, routeLabel: 1 }, { unique: true });

module.exports = mongoose.model('TripLedger', tripLedgerSchema);
