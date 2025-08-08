const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.models.Ad || mongoose.model('Ad', adSchema);
