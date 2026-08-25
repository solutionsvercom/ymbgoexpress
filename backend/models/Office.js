const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['main', 'branch'], default: 'branch' },
    commissionPercent: { type: Number, default: 0, min: 0, max: 100 },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Office', officeSchema);
