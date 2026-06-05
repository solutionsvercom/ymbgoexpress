const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookingsRouter = require('./routes/bookings');
const routesRouter = require('./routes/routes');
const contactRouter = require('./routes/contact');
const trackingRouter = require('./routes/tracking');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'https://ymbgoexpress.in,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/bookings', bookingsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/tracking', trackingRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'YMB GoExpress API is running' });
});

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ YMB GoExpress backend running on http://localhost:${PORT}`);
});
