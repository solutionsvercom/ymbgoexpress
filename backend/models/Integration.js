const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['disconnected', 'connected', 'syncing'], default: 'disconnected' },
    enabled: { type: Boolean, default: false },
    lastSyncAt: { type: Date, default: null },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Integration', integrationSchema);
