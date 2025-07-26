const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create club-ads subdirectory
const clubAdsDir = path.join(uploadsDir, 'club-ads');
if (!fs.existsSync(clubAdsDir)) {
  fs.mkdirSync(clubAdsDir, { recursive: true });
}

// Configure multer for file uploads
// Configure storage engine with dynamic destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('=== MULTER DESTINATION FUNCTION ===');
    console.log('Query params:', req.query);
    console.log('Body params:', req.body);
    
    // Get folder from query parameters first, then body, then default
    const folder = req.query.folder || req.body?.folder || 'general';
    console.log('Determined folder:', folder);
    
    const uploadDir = path.join(__dirname, '..', 'uploads', folder);
    console.log('Upload directory path:', uploadDir);
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating directory:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log('=== MULTER FILENAME FUNCTION ===');
    console.log('Original filename:', file.originalname);
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const extension = path.extname(file.originalname);
    const filename = timestamp + '_' + randomString + extension;
    
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload single file
router.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      console.log('Upload request received');
      console.log('Query params:', req.query);
      console.log('File:', req.file);
      console.log('Body:', req.body);
      
      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get folder from query params or body
      const folder = req.query.folder || req.body.folder || 'general';
      const filePath = `${folder}/${req.file.filename}`;
      
      console.log('File uploaded successfully:', filePath);
      console.log('Full file path:', req.file.path);
      
      res.json({
        success: true,
        filePath: filePath,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: `/uploads/${filePath}`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// File upload endpoint
router.post('/', upload.array('files', 10), (req, res) => {
  console.log('=== UPLOAD ENDPOINT ===');
  console.log('Request query:', req.query);
  console.log('Request body:', req.body);
  console.log('Uploaded files:', req.files);
  
  try {
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const folder = req.query.folder || req.body?.folder || 'general';
    console.log('Using folder for response:', folder);

    const fileUrls = req.files.map(file => {
      console.log('Processing file:', file);
      console.log('File destination:', file.destination);
      console.log('File filename:', file.filename);
      
      // Create the relative path from the uploads folder
      const relativePath = `${folder}/${file.filename}`;
      console.log('Generated relative path:', relativePath);
      
      return {
        url: `/uploads/${relativePath}`,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
      };
    });

    console.log('Sending response with file URLs:', fileUrls);
    res.json({
      message: 'Files uploaded successfully',
      files: fileUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Delete file
router.delete('/', (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const fullPath = path.join(uploadsDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
