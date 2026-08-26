const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const seedRoutes = require('../data/routes');
const seedSchedules = require('../data/schedules');

const FleetBus = require('../models/FleetBus');
const { seedDefaultDuties, syncDutyIndexes } = require('../utils/routeDuties');
const TripLedger = require('../models/TripLedger');
const Office = require('../models/Office');
const Agent = require('../models/Agent');
const Integration = require('../models/Integration');

const seedBuses = [
  {
    busId: 'YMB1001',
    route: 'Indore → Morena',
    currentCity: 'Bhopal',
    nextCity: 'Gwalior',
    eta: '4h 30m',
    lat: 23.2599,
    lng: 77.4126,
    progress: 45,
    cities: ['Indore', 'Bhopal', 'Gwalior', 'Morena']
  },
  {
    busId: 'YMB1002',
    route: 'Morena → Indore',
    currentCity: 'Gwalior',
    nextCity: 'Bhopal',
    eta: '3h 00m',
    lat: 26.2183,
    lng: 78.1828,
    progress: 30,
    cities: ['Morena', 'Gwalior', 'Bhopal', 'Indore']
  },
  {
    busId: 'YMB1003',
    route: 'Indore → Gwalior',
    currentCity: 'Indore',
    nextCity: 'Bhopal',
    eta: '7h 00m',
    lat: 22.7196,
    lng: 75.8577,
    progress: 5,
    cities: ['Indore', 'Bhopal', 'Gwalior']
  }
];

async function seed() {
  const email = (process.env.ADMIN_EMAIL || 'admin@ymbgoexpress.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'YMB Admin';

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, password: hash });
    console.log(`✅ Admin user created: ${email}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${email}`);
  }

  if ((await Route.countDocuments()) === 0) {
    await Route.insertMany(seedRoutes);
    console.log(`✅ Seeded ${seedRoutes.length} routes`);
  }

  await Route.updateMany(
    {
      $nor: [
        { from: /^Indore$/i, to: /^Gwalior$/i },
        { from: /^Gwalior$/i, to: /^Indore$/i }
      ]
    },
    { $set: { active: false } }
  );
  for (const route of seedRoutes) {
    await Route.findOneAndUpdate(
      { from: new RegExp(`^${route.from}$`, 'i'), to: new RegExp(`^${route.to}$`, 'i') },
      { $set: { ...route, active: true } },
      { upsert: true }
    );
  }
  console.log('✅ Routes limited to Indore ↔ Gwalior');

  if ((await Schedule.countDocuments()) === 0) {
    await Schedule.insertMany(seedSchedules);
    console.log(`✅ Seeded ${seedSchedules.length} schedules`);
  }

  if ((await Bus.countDocuments()) === 0) {
    await Bus.insertMany(seedBuses);
    console.log(`✅ Seeded ${seedBuses.length} buses`);
  }

  await Agent.collection.dropIndex('officeId_1_code_1').catch(() => {});
  await Agent.syncIndexes().catch(() => {});
  await syncDutyIndexes();
  await TripLedger.collection.dropIndex('date_1_busCode_1').catch(() => {});
  await TripLedger.syncIndexes().catch(() => {});

  if ((await Office.countDocuments()) === 0) {
    const [gwalior, indore, ujjain] = await Office.create([
      { name: 'Gwalior office', city: 'Gwalior', code: 'GWL', type: 'branch', commissionPercent: 0, address: 'Gwalior, Madhya Pradesh' },
      { name: 'Main Indore office', city: 'Indore', code: 'IDR', type: 'main', commissionPercent: 40, address: 'Indore, Madhya Pradesh' },
      { name: 'Ujjain office', city: 'Ujjain', code: 'UJN', type: 'branch', commissionPercent: 0, address: 'Ujjain, Madhya Pradesh' }
    ]);

    await Agent.create([
      { officeId: gwalior._id, name: 'Gwalior Agent', code: 'Agent', phone: '', commissionPercent: 0 },
      { officeId: gwalior._id, name: 'Gwalior A2', code: 'A2', commissionPercent: 0 },
      { officeId: gwalior._id, name: 'Gwalior A3', code: 'A3', commissionPercent: 0 },
      { officeId: gwalior._id, name: 'Gwalior A4', code: 'A4', commissionPercent: 0 },
      { officeId: indore._id, name: 'Indore Agent', code: 'Agent', commissionPercent: 40 },
      { officeId: indore._id, name: 'Indore A2', code: 'A2', commissionPercent: 40 },
      { officeId: indore._id, name: 'Indore A3', code: 'A3', commissionPercent: 40 },
      { officeId: ujjain._id, name: 'Ujjain Agent', code: 'Agent', commissionPercent: 0 }
    ]);
    console.log('✅ Seeded BMS offices and agents');
  }

  if ((await Integration.countDocuments()) === 0) {
    await Integration.create([
      { key: 'redbus', name: 'API RedBus', status: 'disconnected', enabled: false, notes: 'Inventory sync with RedBus' },
      { key: 'mantis', name: 'Mantis GDS', status: 'disconnected', enabled: false, notes: 'Mantis global distribution system' }
    ]);
    console.log('✅ Seeded BMS integrations');
  }

  const indoreToGwalior = await Route.findOne({ from: /^Indore$/i, to: /^Gwalior$/i });
  const gwaliorToIndore = await Route.findOne({ from: /^Gwalior$/i, to: /^Indore$/i });
  const ledgerBuses = [
    {
      code: '7311',
      oldCode: 'BUS-01',
      name: 'Gwalior ↔ Indore',
      registrationNo: 'MP-09-YM-7311',
      type: 'AC Seater',
      totalSeats: 32,
      status: 'active',
      routeId: indoreToGwalior?._id || null,
      notes: 'Daily ledger bus — Gwalior ↔ Indore'
    },
    {
      code: '7312',
      oldCode: 'BUS-02',
      name: 'Gwalior ↔ Indore',
      registrationNo: 'MP-09-YM-7312',
      type: 'AC Seater',
      totalSeats: 32,
      status: 'active',
      routeId: gwaliorToIndore?._id || null,
      notes: 'Daily ledger bus — Gwalior ↔ Indore'
    }
  ];

  for (const spec of ledgerBuses) {
    const existing =
      (await FleetBus.findOne({ code: spec.code })) ||
      (await FleetBus.findOne({ code: spec.oldCode }));
    const payload = {
      code: spec.code,
      name: spec.name,
      registrationNo: spec.registrationNo,
      type: spec.type,
      totalSeats: spec.totalSeats,
      status: spec.status,
      routeId: spec.routeId,
      notes: spec.notes
    };
    if (existing) {
      await FleetBus.findByIdAndUpdate(existing._id, payload);
    } else {
      await FleetBus.create(payload);
    }
  }
  console.log('✅ Fleet buses ready: 7311 and 7312 (both Gwalior ↔ Indore)');
  await FleetBus.updateMany(
    { code: { $in: ['BUS-01', 'BUS-02', 'BUS7311', 'BUS7312'] } },
    { $set: { status: 'inactive' } }
  );
  await seedDefaultDuties();
}

module.exports = seed;
