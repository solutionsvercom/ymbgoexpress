const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
  { city: { type: String, required: true }, time: { type: String, required: true } },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    seats: { type: Number, required: true, min: 0 },
    type: { type: String, required: true },
    distance: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    image: { type: String, default: '/images/indore-morena.png' },
    stops: { type: [stopSchema], default: [] },
    dp: { type: [stopSchema], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
