const Ad = require('../models/Ad')

// POST /api/ads
exports.createAd = async (req, res) => {
  try {
    const ad = new Ad(req.body)
    await ad.save()
    res.status(201).json(ad)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/ads/upload
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url: imageUrl })
}
