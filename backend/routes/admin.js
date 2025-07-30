const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');

// --- Dummy middleware for development (replace with real auth in production) ---
const auth = (req, res, next) => { next(); };
const role = (roles) => (req, res, next) => { next(); };

// Get all ads
router.get('/ads', auth, role(['admin']), async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Add Ad
router.post('/ads', auth, role(['admin']), async (req, res) => {
  try {
    const { title, description, type } = req.body;

    const ad = new Ad({
      title,
      description,
      type,
      createdBy: new mongoose.Types.ObjectId() // You can replace this with req.user._id later
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ad' });
  }
});

// Update Ad
router.put('/ads/:id', auth, role(['admin']), async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

// Delete Ad
router.delete('/ads/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

// Approve/Deny Ad
router.patch('/ads/:id/status', auth, role(['admin']), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'denied'
    const ad = await Ad.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ad status' });
  }
});

// Analytics (simple counts)
router.get('/analytics', auth, role(['admin']), async (req, res) => {
  try {
    const postCount = await Ad.countDocuments();
    const userCount = await User.countDocuments();
    const companyCount = await Ad.countDocuments({ type: 'product' });
    const privateCount = await Ad.countDocuments({ type: 'event' });

    res.json({ postCount, userCount, companyCount, privateCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
