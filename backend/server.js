require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas (replace with your URI)
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Mongoose Ad model
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});
const Ad = mongoose.model('Ad', adSchema);

// POST /api/ads route
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

// Simple test route
app.get('/', (req, res) => {
  res.send('API Running');
});
