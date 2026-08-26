const Route = require('../models/Route');
const FleetBus = require('../models/FleetBus');
const RouteDuty = require('../models/RouteDuty');

function routeLabel(route) {
  if (!route) return '';
  return `${route.from} To ${route.to}`;
}

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

async function coreRoutes() {
  const routes = await Route.find({
    $or: [
      { from: /^Indore$/i, to: /^Gwalior$/i },
      { from: /^Gwalior$/i, to: /^Indore$/i }
    ]
  }).sort({ from: 1 });
  const list = routes.filter((route) => route.active !== false);
  list.sort((a, b) => {
    const aFirst = /^Indore$/i.test(a.from) ? 0 : 1;
    const bFirst = /^Indore$/i.test(b.from) ? 0 : 1;
    return aFirst - bFirst;
  });
  return list;
}

async function activeFleet() {
  return FleetBus.find({ status: { $ne: 'inactive' } }).sort({ code: 1 });
}

async function resolveDuties(date) {
  const routes = await coreRoutes();
  const fleet = await activeFleet();
  const duties = [];
  for (const bus of fleet) {
    for (const route of routes) {
      const row = await RouteDuty.findOne({
        fleetBusId: bus._id,
        routeId: route._id,
        effectiveFrom: { $lte: date }
      }).sort({ effectiveFrom: -1 });
      if (!row || row.active === false) continue;
      duties.push({
        routeId: route._id,
        from: route.from,
        to: route.to,
        type: route.type,
        departure: route.departure,
        price: route.price,
        routeLabel: routeLabel(route),
        effectiveFrom: row.effectiveFrom,
        fleetBusId: bus._id,
        busCode: bus.code,
        busName: bus.name || row.busName || '',
        bus
      });
    }
  }
  return duties;
}

async function saveDuties(date, assignments = []) {
  const routes = await coreRoutes();
  const fleet = await activeFleet();
  for (const bus of fleet) {
    const match = assignments.find((item) => String(item.fleetBusId) === String(bus._id));
    const selected = new Set((match?.routeIds || []).map((id) => String(id || '')).filter(Boolean));
    for (const route of routes) {
      const active = selected.has(String(route._id));
      await RouteDuty.findOneAndUpdate(
        { fleetBusId: bus._id, routeId: route._id, effectiveFrom: date },
        {
          effectiveFrom: date,
          routeId: route._id,
          routeLabel: routeLabel(route),
          fleetBusId: bus._id,
          busCode: bus.code,
          busName: bus.name || '',
          active
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }
  return resolveDuties(date);
}

async function seedDefaultDuties() {
  const routes = await coreRoutes();
  const buses = await activeFleet();
  if (!routes.length || !buses.length) return;

  if ((await RouteDuty.countDocuments()) === 0) {
    for (const bus of buses) {
      for (const route of routes) {
        await RouteDuty.create({
          effectiveFrom: '2020-01-01',
          routeId: route._id,
          routeLabel: routeLabel(route),
          fleetBusId: bus._id,
          busCode: bus.code,
          busName: bus.name || '',
          active: true
        });
      }
    }
    return;
  }

  const from = todayISO();
  for (const bus of buses) {
    for (const route of routes) {
      const exists = await RouteDuty.findOne({ fleetBusId: bus._id, routeId: route._id });
      if (exists) continue;
      await RouteDuty.create({
        effectiveFrom: from,
        routeId: route._id,
        routeLabel: routeLabel(route),
        fleetBusId: bus._id,
        busCode: bus.code,
        busName: bus.name || '',
        active: true
      });
    }
  }
}

async function syncDutyIndexes() {
  await RouteDuty.collection.dropIndex('routeId_1_effectiveFrom_1').catch(() => {});
  await RouteDuty.syncIndexes().catch(() => {});
}

module.exports = { coreRoutes, resolveDuties, saveDuties, seedDefaultDuties, syncDutyIndexes, routeLabel };
