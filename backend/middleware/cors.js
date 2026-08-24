const allowedOrigins = [
  'https://ymbgoexpress.in',
  'https://www.ymbgoexpress.in',
  'http://ymbgoexpress.in',
  'http://www.ymbgoexpress.in',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function getAllowedOrigins() {
  const extra = String(process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set([...allowedOrigins, ...extra])];
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || getAllowedOrigins().includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

module.exports = { corsOptions, getAllowedOrigins };
