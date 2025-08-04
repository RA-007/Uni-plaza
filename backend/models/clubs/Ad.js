const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  tags: String,
  location: String,
  actionLinks: [
    {
      label: String,
      url: String
    }
  ],
  contactEmail: String,
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Ad', adSchema)
