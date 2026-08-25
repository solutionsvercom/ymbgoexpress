const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const seedRoutes = require('../data/routes');
const seedSchedules = require('../data/schedules');

const FleetBus = require('../models/FleetBus');
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

  if ((await Schedule.countDocuments()) === 0) {
    await Schedule.insertMany(seedSchedules);
    console.log(`✅ Seeded ${seedSchedules.length} schedules`);
  }

  if ((await Bus.countDocuments()) === 0) {
    await Bus.insertMany(seedBuses);
    console.log(`✅ Seeded ${seedBuses.length} buses`);
  }

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

  if ((await FleetBus.countDocuments()) === 0) {
    const routes = await Route.find().sort({ from: 1 }).limit(2);
    await FleetBus.create([
      {
        code: 'BUS-01',
        name: 'Bus 1',
        registrationNo: 'MP-09-YM-0001',
        type: 'AC Sleeper',
        totalSeats: 32,
        status: 'active',
        routeId: routes[0]?._id || null,
        notes: 'Mapped from Add Bus (1)'
      },
      {
        code: 'BUS-02',
        name: 'Bus 2',
        registrationNo: 'MP-09-YM-0002',
        type: 'AC Seater',
        totalSeats: 40,
        status: 'active',
        routeId: routes[1]?._id || routes[0]?._id || null,
        notes: 'Mapped from Add Bus (2)'
      }
    ]);
    console.log('✅ Seeded BMS fleet buses');
  }
}

module.exports = seed;
