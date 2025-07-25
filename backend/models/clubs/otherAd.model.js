const mongoose = require('mongoose');

const otherAdSchema = new mongoose.Schema({
  otherAdTitle: {
    type: String,
    required: [true, 'Ad title is required'],
  },
  otherAdDate: {
    type: Date,
    required: false,
  },
  otherAdDescription: {
    type: String,
    required: [true, 'Ad description is required'],
  },
  university: {
    type: String,
    required: [true, 'University name is required'],
  },
  contactNumber: {
    type: Array,
    required: [true, 'Contact number is required'],
  },
  otherAdLocation: {
    type: String,
    required: false,
  },
  otherAdImage: {
    type: Array,
    required: false,
  },
  otherAdTags: {
    type: Array,
    required: [true, 'Ad tags are required'],
  },
  otherAdRelatedLinks: {
    type: Array,
    required: false,
  },
  otherAdStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
}, {
  timestamps: true
});

const otherAd = mongoose.model('Club_OtherAd', otherAdSchema);
module.exports = otherAd;