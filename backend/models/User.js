const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'student'], required: true },
  otp: String,
  otpExpires: Date,
  savedAds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }],
  interestedAds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }]
});

module.exports = mongoose.model('User', userSchema); 