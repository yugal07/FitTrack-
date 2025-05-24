const express = require('express');
const router = express.Router();
const {
  uploadProgressPhoto,
  uploadProfilePicture,
  deleteProgressPhoto,
  serveFile,
} = require('../controllers/uploadController');
const {
  setUploadType,
  uploadSingle,
  handleUploadError,
} = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Protected routes for uploading
router.post(
  '/progress-photo',
  protect,
  setUploadType('progress-photo'),
  uploadSingle,
  handleUploadError,
  uploadProgressPhoto
);

router.post(
  '/profile-picture',
  protect,
  setUploadType('profile-pic'),
  uploadSingle,
  handleUploadError,
  uploadProfilePicture
);

router.delete('/progress-photo/:id', protect, deleteProgressPhoto);

// Public route for serving files
router.get('/:folder/:filename', serveFile);

module.exports = router;
