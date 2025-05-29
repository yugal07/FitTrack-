const { Profile, User } = require('../models');

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
          message: 'No file uploaded',
        },
      });
    }

    const { category, notes, date } = req.body; // Add date here

    // Debug logging
    console.log('Received date from frontend:', date);
    console.log('Date type:', typeof date);

    // Get user profile
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found',
        },
      });
    }

    // For now, we'll store base64 representation of the file
    const fileBase64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Create progress photo object
    const progressPhoto = {
      date: date ? new Date(date) : new Date(), // Use submitted date or fallback
      photoUrl: dataUri,
      category: category || 'front',
      notes: notes || '',
    };

    console.log('Progress photo before save:', progressPhoto);

    // Add to progress photos array
    profile.progressPhotos.push(progressPhoto);

    // Save profile
    await profile.save();

    console.log('Progress photo after save:', progressPhoto);

    res.status(201).json({
      success: true,
      data: {
        ...progressPhoto,
        message:
          'Photo stored in memory. Implement cloud storage for persistence.',
      },
      message: 'Progress photo uploaded successfully (memory storage)',
    });
  } catch (error) {
    console.error('Error in uploadProgressPhoto:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
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
          message: 'No file uploaded',
        },
      });
    }

    // Get user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Convert file to base64 data URI
    const fileBase64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Update user's profile picture
    user.profilePicture = dataUri;

    // Save user
    await user.save();

    res.json({
      success: true,
      data: {
        profilePicture: dataUri,
        message:
          'Profile picture stored in memory. Implement cloud storage for persistence.',
      },
      message: 'Profile picture updated successfully (memory storage)',
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
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
          message: 'Profile not found',
        },
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
          message: 'Progress photo not found',
        },
      });
    }

    // Remove from array (no file deletion needed in memory storage)
    profile.progressPhotos.splice(photoIndex, 1);

    // Save profile
    await profile.save();

    res.json({
      success: true,
      message: 'Progress photo deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProgressPhoto:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Serve uploaded files (disabled for memory storage)
// @route   GET /api/uploads/:folder/:filename
// @access  Public
exports.serveFile = (req, res) => {
  // In memory storage, files are not served from filesystem
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message:
        'File serving not available with memory storage. Files are stored as data URIs.',
    },
  });
};
