require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Studio Archive AI server is running',
    apiKeyConfigured: !!process.env.DEEPSEEK_API_KEY
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 DeepSeek API Key configured: ${!!process.env.DEEPSEEK_API_KEY}\n`);

  if (!process.env.DEEPSEEK_API_KEY) {
    console.warn('⚠️  WARNING: DEEPSEEK_API_KEY not found in environment variables');
    console.warn('   Please create a .env file in the server/ directory with your API key\n');
  }
});
