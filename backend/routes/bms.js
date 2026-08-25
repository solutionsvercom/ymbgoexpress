const express = require('express');
const auth = require('../middleware/auth');
const FleetBus = require('../models/FleetBus');
const Office = require('../models/Office');
const Agent = require('../models/Agent');
const OfflineBooking = require('../models/OfflineBooking');
const Integration = require('../models/Integration');
const Route = require('../models/Route');
const Counter = require('../models/Counter');
const TripLedger = require('../models/TripLedger');
const OfficeExpense = require('../models/OfficeExpense');
const { money, withLedgerTotals, withOfficeTotals } = require('../utils/ledgerMath');

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

function agentPayload(body = {}) {
  const updates = {};
  for (const key of ['officeId', 'name', 'code', 'phone', 'commissionPercent', 'active']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (updates.officeId) updates.officeId = String(updates.officeId);
  if (updates.name !== undefined) updates.name = String(updates.name || '').trim();
  if (updates.code !== undefined) updates.code = String(updates.code || '').trim();
  if (updates.phone !== undefined) updates.phone = String(updates.phone || '').trim();
  if (updates.commissionPercent !== undefined) updates.commissionPercent = Number(updates.commissionPercent) || 0;
  return updates;
}

async function nextAgentCode(officeId) {
  const count = await Agent.countDocuments({ officeId });
  return count === 0 ? 'Agent' : `A${count + 1}`;
}

router.get('/agents', async (req, res) => {
  const filter = req.query.officeId ? { officeId: req.query.officeId } : {};
  const agents = await Agent.find(filter).populate('officeId', 'name city code').sort({ createdAt: -1 });
  res.json({ success: true, data: agents });
});

router.post('/agents', async (req, res) => {
  try {
    const payload = agentPayload(req.body);
    if (!payload.officeId || !payload.name) {
      return res.status(400).json({ success: false, error: 'Office and name are required' });
    }
    if (!payload.code) payload.code = await nextAgentCode(payload.officeId);
    const agent = await Agent.create(payload);
    res.status(201).json({ success: true, data: await agent.populate('officeId', 'name city code') });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not add agent' });
  }
});

router.patch('/agents/:id', async (req, res) => {
  try {
    const updates = agentPayload(req.body);
    const agent = await Agent.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('officeId', 'name city code');
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    res.json({ success: true, data: agent });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not save agent' });
  }
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

function normalizeReceipts(input = {}) {
  return {
    redbus: money(input.redbus),
    mentis: money(input.mentis),
    indoreOffice: money(input.indoreOffice),
    ujjainOffice: money(input.ujjainOffice),
    luggageOffice: money(input.luggageOffice)
  };
}

function normalizeExpenses(input = {}) {
  const otherItems = Array.isArray(input.otherItems)
    ? input.otherItems
      .map((item) => ({
        note: String(item.note || '').trim(),
        amount: money(item.amount)
      }))
      .filter((item) => item.note || item.amount)
    : [];
  return {
    diesel: money(input.diesel),
    tollBooth: money(input.tollBooth),
    urea: money(input.urea),
    otherItems
  };
}

router.get('/ledgers', async (req, res) => {
  const date = String(req.query.date || '').trim();
  if (!date) return res.status(400).json({ success: false, error: 'date is required' });
  const [buses, ledgers] = await Promise.all([
    FleetBus.find({ status: { $ne: 'inactive' } }).populate('routeId', 'from to type').sort({ code: 1 }),
    TripLedger.find({ date }).sort({ busCode: 1 })
  ]);
  res.json({
    success: true,
    data: {
      date,
      buses,
      ledgers: ledgers.map(withLedgerTotals)
    }
  });
});

router.put('/ledgers', async (req, res) => {
  try {
    const date = String(req.body.date || '').trim();
    const busCode = String(req.body.busCode || '').trim();
    if (!date || !busCode) {
      return res.status(400).json({ success: false, error: 'date and busCode are required' });
    }
    const payload = {
      date,
      busCode,
      busName: String(req.body.busName || '').trim(),
      routeLabel: String(req.body.routeLabel || '').trim(),
      fleetBusId: req.body.fleetBusId || null,
      receipts: normalizeReceipts(req.body.receipts),
      expenses: normalizeExpenses(req.body.expenses)
    };
    const row = await TripLedger.findOneAndUpdate(
      { date, busCode },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.json({ success: true, data: withLedgerTotals(row) });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not save ledger' });
  }
});

router.get('/office-expenses', async (req, res) => {
  const date = String(req.query.date || '').trim();
  if (!date) return res.status(400).json({ success: false, error: 'date is required' });
  const row = await OfficeExpense.findOne({ date });
  const data = row
    ? withOfficeTotals(row)
    : { date, officeName: 'Office Kharcha', items: [], total: 0 };
  if (!data.officeName || data.officeName === 'Office Kareha') data.officeName = 'Office Kharcha';
  res.json({ success: true, data });
});

router.put('/office-expenses', async (req, res) => {
  try {
    const date = String(req.body.date || '').trim();
    if (!date) return res.status(400).json({ success: false, error: 'date is required' });
    const items = Array.isArray(req.body.items)
      ? req.body.items
        .filter((item) => money(item.amount) || String(item.note || '').trim() || String(item.title || '').trim())
        .map((item) => ({
          title: String(item.title || 'Other').trim() || 'Other',
          amount: money(item.amount),
          note: String(item.note || '').trim()
        }))
      : [];
    const requestedName = String(req.body.officeName || '').trim();
    const officeName = !requestedName || requestedName === 'Office Kareha'
      ? 'Office Kharcha'
      : requestedName;
    const row = await OfficeExpense.findOneAndUpdate(
      { date },
      {
        date,
        officeName,
        items
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.json({ success: true, data: withOfficeTotals(row) });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Could not save office expenses' });
  }
});

module.exports = router;
