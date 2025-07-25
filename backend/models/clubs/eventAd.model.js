const mongoose = require('mongoose');

const eventAdSchema = new mongoose.Schema({
  evntAdTitle: {
    type: String,
    required: [true, 'Event name is required'],
  },
  evntAdDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  evntAdTime: {
    type: String,
    required: [true, 'Event time is required'],
  },
  evntAdDescription: {
    type: String,
    required: [true, 'Event description is required'],
  },
  university: {
    type: String,
    required: [true, 'University name is required'],
  },
  evntAdLocation: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: Array,
    required: [true, 'Contact number is required'],
  },
  evntAdImage: {
    type: Array,
    required: false,
  },
  evntAdTags: {
    type: Array,
    required: [true, 'Event tags are required'],
  },
  evntAdRelatedLinks: {
    type: Array,
    required: false,
  },
  evntAdStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
},{
  timestamps: true
});


const EventAd = mongoose.model('Club_EventAd', eventAdSchema);
module.exports = EventAd;