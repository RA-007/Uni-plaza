const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  status: { type: String, default: 'pending' },
  createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.models.Ad || mongoose.model('Ad', adSchema);
