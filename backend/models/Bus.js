const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    busId: { type: String, required: true, unique: true, trim: true },
    route: { type: String, required: true, trim: true },
    currentCity: { type: String, required: true },
    nextCity: { type: String, required: true },
    eta: { type: String, default: '' },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    cities: { type: [String], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bus', busSchema);
