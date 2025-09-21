const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Import database configuration to initialize database
require('./config/database');

// Import routes
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Resource routes
app.use('/api', resourceRoutes);

// External content routes (News, YouTube, Spotify, AI)
const externalContentRoutes = require('./routes/externalContent');
app.use('/api/external', externalContentRoutes);

// Debug routes for database testing
const debugRoutes = require('./routes/debug');
app.use('/api/debug', debugRoutes);

// API endpoint to fetch all users from Descope
app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching users from Descope...');
    
    const response = await axios.post(
      `https://api.descope.com/v1/mgmt/user/search`,
      {
        limit: 100,
        page: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DESCOPE_PROJECT_ID}:${process.env.DESCOPE_MANAGEMENT_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Descope API response:', response.data);
    
    if (response.data && response.data.users) {
      res.json({
        success: true,
        users: response.data.users,
        total: response.data.users.length
      });
    } else {
      res.json({
        success: true,
        users: [],
        total: 0
      });
    }
  } catch (error) {
    console.error('Error fetching users from Descope:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Database seeding endpoint (for development)
app.post('/api/seed-database', async (req, res) => {
  try {
    const { seedDatabase } = require('./scripts/seedDatabase');
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Project ID: ${process.env.DESCOPE_PROJECT_ID}`);
  console.log(`Management Key: ${process.env.DESCOPE_MANAGEMENT_KEY ? 'Set' : 'Not set'}`);
  console.log(`✅ Server is actively listening on port ${PORT}`);
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
  }
});
