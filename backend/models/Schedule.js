const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
  { city: { type: String, required: true }, time: { type: String, required: true } },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    distance: { type: String, required: true },
    stops: { type: [stopSchema], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
