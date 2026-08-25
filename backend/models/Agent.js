const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    officeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Office', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    commissionPercent: { type: Number, default: 0, min: 0, max: 100 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

agentSchema.index({ officeId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Agent', agentSchema);
