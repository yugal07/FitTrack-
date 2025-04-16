// User Controllers

const { User, Profile } = require('../models');

// @desc    Get user profile
// @route   GET /api/users
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
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

    // Get user profile data
    const profile = await Profile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          fitnessLevel: user.fitnessLevel,
          preferences: user.preferences,
        },
        profile: profile || {},
      },
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, fitnessLevel, profilePicture } = req.body;

    // Find user and update
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

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (fitnessLevel) user.fitnessLevel = fitnessLevel;
    if (profilePicture) user.profilePicture = profilePicture;

    // Save updated user
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        fitnessLevel: user.fitnessLevel,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update user preferences
// @route   PATCH /api/users/preferences
// @access  Private
exports.updateUserPreferences = async (req, res) => {
  try {
    const { darkMode, notifications, measurementUnit } = req.body;

    // Find user and update preferences
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

    // Update preferences
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    
    if (notifications) {
      if (notifications.workoutReminders !== undefined) 
        user.preferences.notifications.workoutReminders = notifications.workoutReminders;
      if (notifications.goalMilestones !== undefined) 
        user.preferences.notifications.goalMilestones = notifications.goalMilestones;
      if (notifications.nutritionReminders !== undefined) 
        user.preferences.notifications.nutritionReminders = notifications.nutritionReminders;
    }
    
    if (measurementUnit) user.preferences.measurementUnit = measurementUnit;

    // Save updated user
    await user.save();

    res.json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users
// @access  Private
exports.deleteUserAccount = async (req, res) => {
  try {
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

    // Delete user profile
    await Profile.findOneAndDelete({ userId: req.user._id });
    
    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};