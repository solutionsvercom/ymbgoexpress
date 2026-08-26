const Route = require('../models/Route');
const FleetBus = require('../models/FleetBus');
const RouteDuty = require('../models/RouteDuty');

function routeLabel(route) {
  if (!route) return '';
  return `${route.from} To ${route.to}`;
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

async function resolveDuties(date) {
  const routes = await coreRoutes();
  const duties = [];
  for (const route of routes) {
    const row = await RouteDuty.findOne({
      routeId: route._id,
      effectiveFrom: { $lte: date }
    }).sort({ effectiveFrom: -1 }).populate('fleetBusId', 'code name status routeId');
    duties.push({
      routeId: route._id,
      from: route.from,
      to: route.to,
      type: route.type,
      departure: route.departure,
      price: route.price,
      routeLabel: routeLabel(route),
      effectiveFrom: row?.effectiveFrom || null,
      fleetBusId: row?.fleetBusId?._id || row?.fleetBusId || null,
      busCode: row?.busCode || row?.fleetBusId?.code || '',
      busName: row?.busName || row?.fleetBusId?.name || '',
      bus: row?.fleetBusId || null
    });
  }
  return duties;
}

async function saveDuties(date, assignments = []) {
  const routes = await coreRoutes();
  const fleet = await FleetBus.find({ status: { $ne: 'inactive' } }).sort({ code: 1 });
  const paired = [...assignments];

  if (routes.length >= 2) {
    const firstId = String(paired.find((item) => String(item.routeId) === String(routes[0]._id))?.fleetBusId || '');
    if (firstId) {
      const opposite = fleet.find((bus) => String(bus._id) !== firstId);
      const secondRouteId = String(routes[1]._id);
      const idx = paired.findIndex((item) => String(item.routeId) === secondRouteId);
      const oppositeId = opposite?._id || null;
      if (idx >= 0) paired[idx] = { routeId: routes[1]._id, fleetBusId: oppositeId };
      else paired.push({ routeId: routes[1]._id, fleetBusId: oppositeId });
    }
  }

  const usedBuses = new Set();
  const saved = [];
  for (const route of routes) {
    const match = paired.find((item) => String(item.routeId) === String(route._id));
    const fleetBusId = match?.fleetBusId || null;
    let bus = null;
    if (fleetBusId) {
      const key = String(fleetBusId);
      if (usedBuses.has(key)) {
        throw new Error('The same bus cannot run both routes on this date.');
      }
      usedBuses.add(key);
      bus = await FleetBus.findById(fleetBusId);
      if (!bus) throw new Error('Bus not found');
    }
    const row = await RouteDuty.findOneAndUpdate(
      { routeId: route._id, effectiveFrom: date },
      {
        effectiveFrom: date,
        routeId: route._id,
        routeLabel: routeLabel(route),
        fleetBusId: bus?._id || null,
        busCode: bus?.code || '',
        busName: bus?.name || ''
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (bus) {
      await FleetBus.findByIdAndUpdate(bus._id, { routeId: route._id, name: routeLabel(route) });
    }
    saved.push(row);
  }
  return resolveDuties(date);
}

async function seedDefaultDuties() {
  if ((await RouteDuty.countDocuments()) > 0) return;
  const routes = await coreRoutes();
  const buses = await FleetBus.find({ status: { $ne: 'inactive' } });
  for (const route of routes) {
    const bus = buses.find((item) => String(item.routeId || '') === String(route._id))
      || (route.from.match(/^Indore$/i) ? buses.find((item) => item.code === '7311') : buses.find((item) => item.code === '7312'));
    await RouteDuty.create({
      effectiveFrom: '2020-01-01',
      routeId: route._id,
      routeLabel: routeLabel(route),
      fleetBusId: bus?._id || null,
      busCode: bus?.code || '',
      busName: bus?.name || ''
    });
  }
}

module.exports = { coreRoutes, resolveDuties, saveDuties, seedDefaultDuties, routeLabel };
