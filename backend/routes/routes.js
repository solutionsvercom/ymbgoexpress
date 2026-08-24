const express = require('express');
const Route = require('../models/Route');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { from, to } = req.query;
  const filter = { active: true };
  if (from) filter.from = new RegExp(`^${from}$`, 'i');
  if (to) filter.to = new RegExp(`^${to}$`, 'i');
  const routes = await Route.find(filter).sort({ from: 1, to: 1 });
  res.json({ success: true, data: routes });
});

router.get('/all', auth, async (req, res) => {
  const routes = await Route.find().sort({ createdAt: -1 });
  res.json({ success: true, data: routes });
});

router.get('/:id', async (req, res) => {
  const route = await Route.findById(req.params.id).catch(() => null);
  if (!route) return res.status(404).json({ success: false, error: 'Route not found' });
  res.json({ success: true, data: route });
});

router.post('/', auth, async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not create route' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).catch(() => null);
  if (!route) return res.status(404).json({ success: false, error: 'Route not found' });
  res.json({ success: true, data: route });
});

router.delete('/:id', auth, async (req, res) => {
  const route = await Route.findByIdAndDelete(req.params.id).catch(() => null);
  if (!route) return res.status(404).json({ success: false, error: 'Route not found' });
  res.json({ success: true, message: 'Route deleted' });
});

module.exports = router;
