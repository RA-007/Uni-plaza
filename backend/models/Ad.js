const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['event', 'product', 'other'] },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', adSchema); 