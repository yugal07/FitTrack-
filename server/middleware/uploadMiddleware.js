// Upload Middleware

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// For Vercel deployment, we'll use memory storage instead of disk storage
// In production, you should use cloud storage like Cloudinary

const storage = multer.memoryStorage(); // Use memory storage for Vercel

// File filter - check if file type is allowed
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware to set upload type (keeping for compatibility)
exports.setUploadType = type => (req, res, next) => {
  req.uploadType = type;
  next();
};

// Export the configured multer middleware
exports.uploadSingle = upload.single('file');

// Handle upload errors
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File is too large. Maximum size is 5MB.',
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message,
      },
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE',
        message: err.message,
      },
    });
  }

  next();
};

// Delete file helper (disabled for Vercel)
exports.deleteFile = filePath => {
  // In Vercel environment, files are in memory only
  // This function is kept for compatibility but doesn't do anything
  console.log(
    `File deletion requested for: ${filePath} (memory storage - no action needed)`
  );
  return true;
};
