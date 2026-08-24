const mongoose = require('mongoose');

function isAtlasUri(uri) {
  return /^mongodb\+srv:\/\//i.test(uri);
}

function redact(text) {
  return String(text || '').replace(/\/\/[^@/]+@/g, '//***@');
}

function attachConnectionGuards() {
  mongoose.connection.on('error', (err) => {
    console.error('⚠️ MongoDB error:', redact(err.message));
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected; retrying...');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing from .env');
  }

  mongoose.set('strictQuery', true);
  attachConnectionGuards();

  const options = {
    serverSelectionTimeoutMS: isAtlasUri(uri) ? 20000 : 4000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
    family: 4
  };

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await mongoose.connect(uri, options);
      console.log(`✅ MongoDB connected: db=${mongoose.connection.name}`);
      return;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ MongoDB connection attempt ${attempt}/3 failed`);
      console.warn(`   ${redact(err.message)}`);
      try { await mongoose.disconnect(); } catch { /* ignore */ }
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    }
  }

  if (isAtlasUri(uri)) {
    throw lastError || new Error('Atlas connection failed. Check Network Access IP list and that the cluster is running.');
  }

  try { await mongoose.disconnect(); } catch { /* ignore */ }
  let MongoMemoryServer;
  try {
    ({ MongoMemoryServer } = require('mongodb-memory-server'));
  } catch {
    throw lastError || new Error('MongoDB is not available');
  }
  const memory = await MongoMemoryServer.create();
  await mongoose.connect(memory.getUri());
  console.log(`✅ In-memory MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = connectDB;
