require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Load environment variables
const MONGOURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Import routes for Clubs
const productAdRoutes = require('./routes/clubs/productAd.route');
const eventAdRoutes = require('./routes/clubs/eventAd.route');
const otherAdRoutes = require('./routes/clubs/otherAd.route');
// End Import routes for Clubs


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*'}));
app.use(express.json());


// Routes For Clubs
app.use('/api/club/product-ads', productAdRoutes);
app.use('/api/club/event-ads', eventAdRoutes);
app.use('/api/club/other-ads', otherAdRoutes);


// Use separate file for store models.
// Mongoose Ad model
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});
const Ad = mongoose.model('Ad', adSchema);

// Use separete file for store routes.
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

// GET /api/ads route
app.get("/", (req, res) => {
  res.send("Welcome to Uni-Plaza API");
});

mongoose
  .connect(
    MONGOURI
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed!", err);
  });

