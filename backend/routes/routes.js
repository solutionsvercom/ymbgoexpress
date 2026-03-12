const express = require('express');
const router = express.Router();
const allRoutes = require('../data/routes');

router.get('/', (req, res) => {
  const { from, to } = req.query;
  let filtered = allRoutes;
  if (from) filtered = filtered.filter(r => r.from.toLowerCase() === from.toLowerCase());
  if (to) filtered = filtered.filter(r => r.to.toLowerCase() === to.toLowerCase());
  res.json({ success: true, data: filtered });
});

router.get('/:id', (req, res) => {
  const route = allRoutes.find(r => r.id === parseInt(req.params.id));
  if (!route) return res.status(404).json({ success: false, error: 'Route not found' });
  res.json({ success: true, data: route });
});

module.exports = router;
