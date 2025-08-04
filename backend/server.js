require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

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
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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

// Passport serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // TODO: Find or create user in DB here
  return done(null, profile);
}));

// Facebook OAuth setup
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
  // TODO: Find or create user in DB here
  return done(null, profile);
}));

// Google routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3001/student');
  }
);

// Facebook routes
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3001/student');
  }
);

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
