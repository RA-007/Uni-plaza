require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Load environment variables
const MONGOURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// ✅ Import all routes
const authRoutes = require('./routes/auth');
const productAdRoutes = require('./routes/clubs/productAd.route');
const eventAdRoutes = require('./routes/clubs/eventAd.route');
const otherAdRoutes = require('./routes/clubs/otherAd.route');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

// ✅ Import Ad model here (after defining in models/Ad.js)
const Ad = require('./models/Ad');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/club/product-ads', productAdRoutes);
app.use('/api/club/event-ads', eventAdRoutes);
app.use('/api/club/other-ads', otherAdRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Test API route
app.get('/', (req, res) => {
  res.send('Welcome to Uni-Plaza API');
});

// POST /api/ads
app.post('/api/ads', async (req, res) => {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error('Error saving ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Connect to DB and start server
mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (without DB)`);
    });
  });
