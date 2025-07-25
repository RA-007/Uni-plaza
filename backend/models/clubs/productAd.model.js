const mongoose = require('mongoose');

const productAdSchema = new mongoose.Schema({
  prodAdName: {
    type: String,
    required: [true, 'Product name is required'],
  },
  prodAdDescription: {
    type: String,
    required: [true, 'Product description is required'],
  },
  university: {
    type: String,
    required: [true, 'University name is required'],
  },
  prodAdPrice: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  contactNumber: {
    type: Array,
    required: [true, 'Contact number is required'],
  },
  prodAdImage: {
    type: Array,
    required: false,
  },
  prodAdTags: {
    type: Array,
    required: [true, 'Product tags are required'],
  },
  prodAdRelatedLinks: {
    type: Array,
    required: false,
  },
  prodAdStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
},{
  timestamps: true,
});


const ProductAd = mongoose.model('Club_ProductAd', productAdSchema);
module.exports = ProductAd;