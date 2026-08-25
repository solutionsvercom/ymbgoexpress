const mongoose = require('mongoose');

const billPhotoSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, trim: true, index: true },
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, default: '', trim: true },
    mimeType: { type: String, default: 'image/jpeg' },
    size: { type: Number, default: 0 },
    kind: { type: String, enum: ['trip', 'office', 'mixed', 'unknown'], default: 'unknown' },
    extracted: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BillPhoto', billPhotoSchema);
