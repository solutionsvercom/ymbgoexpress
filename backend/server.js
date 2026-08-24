const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seed = require('./config/seed');
const { corsOptions } = require('./middleware/cors');

const authRouter = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');
const routesRouter = require('./routes/routes');
const contactRouter = require('./routes/contact');
const trackingRouter = require('./routes/tracking');
const schedulesRouter = require('./routes/schedules');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const publicDir = path.join(__dirname, 'public');

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'YMB GoExpress API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use(express.static(publicDir, { index: false }));

app.get(/^(?!\/api).*/, (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.sendFile(path.join(publicDir, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.status(404).send('Frontend build not found. Run npm run build.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  const message = reason && reason.message ? reason.message : String(reason);
  console.error('⚠️ Unhandled promise rejection:', message.replace(/\/\/[^@/]+@/g, '//***@'));
});

async function start() {
  try {
    await connectDB();
    await seed();
    app.listen(PORT, HOST, () => {
      console.log(`✅ YMB GoExpress running on ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('Check MONGODB_URI and that MongoDB Atlas Network Access allows this server.');
    process.exit(1);
  }
}

start();
