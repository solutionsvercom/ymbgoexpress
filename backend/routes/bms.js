const express = require('express');
const auth = require('../middleware/auth');
const FleetBus = require('../models/FleetBus');
const Office = require('../models/Office');
const Agent = require('../models/Agent');
const OfflineBooking = require('../models/OfflineBooking');
const Integration = require('../models/Integration');
const Route = require('../models/Route');
const Counter = require('../models/Counter');

const router = express.Router();
router.use(auth);

async function stats(_req, res) {
  const [buses, offices, agents, offline, connectedApis, routes] = await Promise.all([
    FleetBus.countDocuments(),
    Office.countDocuments({ active: true }),
    Agent.countDocuments({ active: true }),
    OfflineBooking.countDocuments(),
    Integration.countDocuments({ status: 'connected' }),
    Route.countDocuments({ active: true })
  ]);
  const recentOffline = await OfflineBooking.find().sort({ createdAt: -1 }).limit(5)
    .populate('officeId', 'name city').populate('agentId', 'name code');
  res.json({
    success: true,
    data: { buses, offices, agents, offline, connectedApis, routes, recentOffline }
  });
}

router.get('/stats', stats);

router.get('/map', async (_req, res) => {
  const [buses, routes, offices, agents, integrations] = await Promise.all([
    FleetBus.find().populate('routeId', 'from to type').sort({ code: 1 }),
    Route.find({ active: true }).select('from to type departure').sort({ from: 1 }).limit(20),
    Office.find().sort({ type: -1, city: 1 }),
    Agent.find().populate('officeId', 'name city').sort({ code: 1 }),
    Integration.find().sort({ name: 1 })
  ]);
  res.json({ success: true, data: { buses, routes, offices, agents, integrations } });
});

router.get('/buses', async (_req, res) => {
  const buses = await FleetBus.find().populate('routeId', 'from to type').sort({ createdAt: -1 });
  res.json({ success: true, data: buses });
});

router.post('/buses', async (req, res) => {
  try {
    const bus = await FleetBus.create(req.body);
    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not add bus' });
  }
});

router.patch('/buses/:id', async (req, res) => {
  const bus = await FleetBus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).catch(() => null);
  if (!bus) return res.status(404).json({ success: false, error: 'Bus not found' });
  res.json({ success: true, data: bus });
});

router.delete('/buses/:id', async (req, res) => {
  const bus = await FleetBus.findByIdAndDelete(req.params.id).catch(() => null);
  if (!bus) return res.status(404).json({ success: false, error: 'Bus not found' });
  res.json({ success: true, message: 'Bus deleted' });
});

router.get('/offices', async (_req, res) => {
  const offices = await Office.find().sort({ type: -1, city: 1 });
  res.json({ success: true, data: offices });
});

router.post('/offices', async (req, res) => {
  try {
    const office = await Office.create(req.body);
    res.status(201).json({ success: true, data: office });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not add office' });
  }
});

router.patch('/offices/:id', async (req, res) => {
  const office = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).catch(() => null);
  if (!office) return res.status(404).json({ success: false, error: 'Office not found' });
  res.json({ success: true, data: office });
});

router.delete('/offices/:id', async (req, res) => {
  await Agent.deleteMany({ officeId: req.params.id });
  const office = await Office.findByIdAndDelete(req.params.id).catch(() => null);
  if (!office) return res.status(404).json({ success: false, error: 'Office not found' });
  res.json({ success: true, message: 'Office deleted' });
});

router.get('/agents', async (req, res) => {
  const filter = req.query.officeId ? { officeId: req.query.officeId } : {};
  const agents = await Agent.find(filter).populate('officeId', 'name city code').sort({ createdAt: -1 });
  res.json({ success: true, data: agents });
});

router.post('/agents', async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, data: await agent.populate('officeId', 'name city code') });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not add agent' });
  }
});

router.patch('/agents/:id', async (req, res) => {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('officeId', 'name city code')
    .catch(() => null);
  if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
  res.json({ success: true, data: agent });
});

router.delete('/agents/:id', async (req, res) => {
  const agent = await Agent.findByIdAndDelete(req.params.id).catch(() => null);
  if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
  res.json({ success: true, message: 'Agent deleted' });
});

router.get('/offline', async (_req, res) => {
  const rows = await OfflineBooking.find().sort({ createdAt: -1 })
    .populate('officeId', 'name city')
    .populate('agentId', 'name code')
    .populate('fleetBusId', 'code name');
  res.json({ success: true, data: rows });
});

router.post('/offline', async (req, res) => {
  try {
    const seq = await Counter.next('offline');
    const booking = await OfflineBooking.create({
      ...req.body,
      bookingRef: `OFF${seq}`
    });
    const populated = await OfflineBooking.findById(booking._id)
      .populate('officeId', 'name city')
      .populate('agentId', 'name code')
      .populate('fleetBusId', 'code name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not create booking' });
  }
});

router.patch('/offline/:id', async (req, res) => {
  const allowed = ['status', 'notes', 'amount', 'seats', 'travelDate'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const row = await OfflineBooking.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate('officeId', 'name city')
    .populate('agentId', 'name code')
    .populate('fleetBusId', 'code name')
    .catch(() => null);
  if (!row) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: row });
});

router.get('/integrations', async (_req, res) => {
  const rows = await Integration.find().sort({ name: 1 });
  res.json({ success: true, data: rows });
});

router.patch('/integrations/:id', async (req, res) => {
  const allowed = ['status', 'enabled', 'notes'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (updates.status === 'connected') updates.lastSyncAt = new Date();
  const row = await Integration.findByIdAndUpdate(req.params.id, updates, { new: true }).catch(() => null);
  if (!row) return res.status(404).json({ success: false, error: 'Integration not found' });
  res.json({ success: true, data: row });
});

module.exports = router;
