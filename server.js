const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const locationsRouter = require('./routes/locations');
const routesRouter = require('./routes/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/locations', locationsRouter);
app.use('/api/routes', routesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Campus Navigator API is running', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Smart Campus Navigator Backend running on http://localhost:${PORT}`);
  console.log(`📍 Locations API: http://localhost:${PORT}/api/locations`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health\n`);
});

server.on('error', (e) => {
  console.error('Server error:', e);
});
