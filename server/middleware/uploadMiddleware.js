const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  const progressPhotosDir = path.join(uploadDir, 'progress-photos');
  const profilePicsDir = path.join(uploadDir, 'profile-pics');

  // Create main uploads directory
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Create subdirectories
  if (!fs.existsSync(progressPhotosDir)) {
    fs.mkdirSync(progressPhotosDir);
  }

  if (!fs.existsSync(profilePicsDir)) {
    fs.mkdirSync(profilePicsDir);
  }
};

// Initialize directories
createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    let uploadPath;

    if (req.uploadType === 'profile-pic') {
      uploadPath = path.join(__dirname, '../uploads/profile-pics');
    } else if (req.uploadType === 'progress-photo') {
      uploadPath = path.join(__dirname, '../uploads/progress-photos');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const randomString = crypto.randomBytes(16).toString('hex');
    const fileExt = path.extname(file.originalname);
    cb(null, `${randomString}${fileExt}`);
  },
});

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

// Middleware to set upload type
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

// Delete file helper
exports.deleteFile = filePath => {
  const fullPath = path.join(__dirname, '../', filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }

  return false;
};
