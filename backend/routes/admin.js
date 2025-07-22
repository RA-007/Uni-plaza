const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');

// --- Simple middleware for demonstration (replace with real auth in production) ---
const auth = (req, res, next) => { next(); };
const role = (roles) => (req, res, next) => { next(); };

// Get all ads
router.get('/ads', auth, role(['admin']), async (req, res) => {
  const ads = await Ad.find();
  res.json(ads);
});

// Add Ad
router.post('/ads', auth, role(['admin']), async (req, res) => {
  const { title, description, type } = req.body;
  const ad = new Ad({ title, description, type, createdBy: mongoose.Types.ObjectId() });
  await ad.save();
  res.json(ad);
});

// Update Ad
router.put('/ads/:id', auth, role(['admin']), async (req, res) => {
  const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ad);
});

// Delete Ad
router.delete('/ads/:id', auth, role(['admin']), async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ad deleted' });
});

// Approve/Deny Ad
router.patch('/ads/:id/status', auth, role(['admin']), async (req, res) => {
  const { status } = req.body; // 'approved' or 'denied'
  const ad = await Ad.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(ad);
});

// Analytics (simple counts)
router.get('/analytics', auth, role(['admin']), async (req, res) => {
  const postCount = await Ad.countDocuments();
  const userCount = await User.countDocuments();
  const companyCount = await Ad.countDocuments({ type: 'product' });
  const privateCount = await Ad.countDocuments({ type: 'event' });
  res.json({ postCount, userCount, companyCount, privateCount });
});

module.exports = router; 