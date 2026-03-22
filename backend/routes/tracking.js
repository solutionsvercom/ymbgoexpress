const express = require('express');
const router = express.Router();

const busLocations = {
  'YMB1001': { busId: 'YMB1001', route: 'Indore → Morena', currentCity: 'Bhopal', nextCity: 'Gwalior', eta: '4h 30m', lat: 23.2599, lng: 77.4126, progress: 45 },
  'YMB1002': { busId: 'YMB1002', route: 'Morena → Indore', currentCity: 'Gwalior', nextCity: 'Bhopal', eta: '3h 00m', lat: 26.2183, lng: 78.1828, progress: 30 },
  'YMB1003': { busId: 'YMB1003', route: 'Indore → Gwalior', currentCity: 'Indore', nextCity: 'Bhopal', eta: '7h 00m', lat: 22.7196, lng: 75.8577, progress: 5 },
};

router.get('/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const busKey = Object.keys(busLocations)[parseInt(bookingId.replace(/\D/g, '')) % 3];
  const location = busLocations[busKey];
  if (!location) return res.status(404).json({ success: false, error: 'Bus not found for this booking' });
  const dynamic = { ...location, progress: (location.progress + Math.floor(Math.random() * 5)) % 100 };
  res.json({ success: true, data: dynamic });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: Object.values(busLocations) });
});

module.exports = router;
