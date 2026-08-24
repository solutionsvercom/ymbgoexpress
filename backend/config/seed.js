const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const seedRoutes = require('../data/routes');
const seedSchedules = require('../data/schedules');

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
}

module.exports = seed;
