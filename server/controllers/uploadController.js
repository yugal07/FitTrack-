
const { Profile, User } = require('../models');
const { deleteFile } = require('../middleware/uploadMiddleware');
const path = require('path');

// @desc    Upload progress photo
// @route   POST /api/uploads/progress-photo
// @access  Private
exports.uploadProgressPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded'
        }
      });
    }

    const { category, notes } = req.body;

    // Get user profile
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Delete the uploaded file
      deleteFile(req.file.path);
      
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found'
        }
      });
    }

    // Create file path for database (relative path)
    const filePath = `uploads/progress-photos/${req.file.filename}`;

    // Create progress photo object
    const progressPhoto = {
      date: new Date(),
      photoUrl: filePath,
      category: category || 'front',
      notes: notes || ''
    };

    // Add to progress photos array
    profile.progressPhotos.push(progressPhoto);

    // Save profile
    await profile.save();

    res.status(201).json({
      success: true,
      data: {
        ...progressPhoto,
        url: `${req.protocol}://${req.get('host')}/${filePath}`
      },
      message: 'Progress photo uploaded successfully'
    });
  } catch (error) {
    console.error('Error in uploadProgressPhoto:', error);
    
    // Delete the uploaded file if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/uploads/profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded'
        }
      });
    }

    // Get user
    const user = await User.findById(req.user._id);

    if (!user) {
      // Delete the uploaded file
      deleteFile(req.file.path);
      
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Delete the old profile picture if it exists
    if (user.profilePicture) {
      deleteFile(user.profilePicture);
    }

    // Create file path for database (relative path)
    const filePath = `uploads/profile-pics/${req.file.filename}`;

    // Update user's profile picture
    user.profilePicture = filePath;

    // Save user
    await user.save();

    res.json({
      success: true,
      data: {
        profilePicture: filePath,
        url: `${req.protocol}://${req.get('host')}/${filePath}`
      },
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    
    // Delete the uploaded file if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Delete progress photo
// @route   DELETE /api/uploads/progress-photo/:id
// @access  Private
exports.deleteProgressPhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found'
        }
      });
    }

    // Find photo by ID
    const photoIndex = profile.progressPhotos.findIndex(
      photo => photo._id.toString() === req.params.id
    );

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PHOTO_NOT_FOUND',
          message: 'Progress photo not found'
        }
      });
    }

    // Get file path before removing from array
    const filePath = profile.progressPhotos[photoIndex].photoUrl;

    // Remove from array
    profile.progressPhotos.splice(photoIndex, 1);

    // Save profile
    await profile.save();

    // Delete file from server
    deleteFile(filePath);

    res.json({
      success: true,
      message: 'Progress photo deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProgressPhoto:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Serve uploaded files
// @route   GET /api/uploads/:folder/:filename
// @access  Public
exports.serveFile = (req, res) => {
  const { folder, filename } = req.params;
  
  // Validate folder to prevent directory traversal
  const allowedFolders = ['progress-photos', 'profile-pics'];
  
  if (!allowedFolders.includes(folder)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FOLDER',
        message: 'Invalid folder specified'
      }
    });
  }
  
  // Construct file path
  const filePath = path.join(__dirname, '../uploads', folder, filename);
  
  // Send file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'File not found'
        }
      });
    }
  });
};