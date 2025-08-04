const express = require('express')
const router = express.Router()
const multer = require('multer')
const { createAd, uploadImage } = require('../controllers/adController')

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})
const upload = multer({ storage })

router.post('/', createAd)
router.post('/upload', upload.single('file'), uploadImage)

module.exports = router
