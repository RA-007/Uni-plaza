const mongoose = require('mongoose');

const studentAdSchema = new mongoose.Schema({
  adType: {
    type: String,
    enum: ['event', 'product', 'other'],
    required: true
  },
  adData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shareCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentAdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const StudentAd = mongoose.model('StudentAd', studentAdSchema);
module.exports = StudentAd;