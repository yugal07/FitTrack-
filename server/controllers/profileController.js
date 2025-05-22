const { Profile } = require('../models');

// @desc    Get user measurements
// @route   GET /api/profiles/measurements
// @access  Private
exports.getMeasurements = async (req, res) => {
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

    res.json({
      success: true,
      data: profile.measurements || [],
    });
  } catch (error) {
    console.error('Error in getMeasurements:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Add new measurement
// @route   POST /api/profiles/measurements
// @access  Private
exports.addMeasurement = async (req, res) => {
  try {
    const {
      weight,
      height,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      notes,
      date,
    } = req.body;

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

    // Create new measurement
    const newMeasurement = {
      date: date || new Date(),
      weight,
      height,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      notes,
    };

    // Add to measurements array
    profile.measurements.push(newMeasurement);

    // Save profile
    await profile.save();

    res.status(201).json({
      success: true,
      data: newMeasurement,
      message: 'Measurement added successfully',
    });
  } catch (error) {
    console.error('Error in addMeasurement:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update measurement
// @route   PUT /api/profiles/measurements/:id
// @access  Private
exports.updateMeasurement = async (req, res) => {
  try {
    const {
      weight,
      height,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      notes,
      date,
    } = req.body;

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

    // Find measurement by ID
    const measurementIndex = profile.measurements.findIndex(
      m => m._id.toString() === req.params.id
    );

    if (measurementIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MEASUREMENT_NOT_FOUND',
          message: 'Measurement not found',
        },
      });
    }

    // Update measurement fields
    if (date) {
      profile.measurements[measurementIndex].date = date;
    }
    if (weight !== undefined) {
      profile.measurements[measurementIndex].weight = weight;
    }
    if (height !== undefined) {
      profile.measurements[measurementIndex].height = height;
    }
    if (bodyFat !== undefined) {
      profile.measurements[measurementIndex].bodyFat = bodyFat;
    }
    if (chest !== undefined) {
      profile.measurements[measurementIndex].chest = chest;
    }
    if (waist !== undefined) {
      profile.measurements[measurementIndex].waist = waist;
    }
    if (hips !== undefined) {
      profile.measurements[measurementIndex].hips = hips;
    }
    if (arms !== undefined) {
      profile.measurements[measurementIndex].arms = arms;
    }
    if (thighs !== undefined) {
      profile.measurements[measurementIndex].thighs = thighs;
    }
    if (notes !== undefined) {
      profile.measurements[measurementIndex].notes = notes;
    }

    // Save profile
    await profile.save();

    res.json({
      success: true,
      data: profile.measurements[measurementIndex],
      message: 'Measurement updated successfully',
    });
  } catch (error) {
    console.error('Error in updateMeasurement:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete measurement
// @route   DELETE /api/profiles/measurements/:id
// @access  Private
exports.deleteMeasurement = async (req, res) => {
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

    // Find measurement by ID
    const measurementIndex = profile.measurements.findIndex(
      m => m._id.toString() === req.params.id
    );

    if (measurementIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MEASUREMENT_NOT_FOUND',
          message: 'Measurement not found',
        },
      });
    }

    // Remove measurement
    profile.measurements.splice(measurementIndex, 1);

    // Save profile
    await profile.save();

    res.json({
      success: true,
      message: 'Measurement deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteMeasurement:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get progress photos
// @route   GET /api/profiles/progress-photos
// @access  Private
exports.getProgressPhotos = async (req, res) => {
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

    res.json({
      success: true,
      data: profile.progressPhotos || [],
    });
  } catch (error) {
    console.error('Error in getProgressPhotos:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Upload progress photo
// @route   POST /api/profiles/progress-photos
// @access  Private
exports.uploadProgressPhoto = async (req, res) => {
  try {
    const { photoUrl, category, notes, date } = req.body;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Photo URL is required',
        },
      });
    }

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

    // Create new progress photo
    const newPhoto = {
      date: date || new Date(),
      photoUrl,
      category: category || 'front',
      notes,
    };

    // Add to progress photos array
    profile.progressPhotos.push(newPhoto);

    // Save profile
    await profile.save();

    res.status(201).json({
      success: true,
      data: newPhoto,
      message: 'Progress photo added successfully',
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

// @desc    Delete progress photo
// @route   DELETE /api/profiles/progress-photos/:id
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
      p => p._id.toString() === req.params.id
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

    // Remove photo
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

// @desc    Get photo comparison
// @route   GET /api/profiles/progress-photos/comparison
// @access  Private
exports.getPhotoComparison = async (req, res) => {
  try {
    const { category, beforeDate, afterDate } = req.query;

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

    // Filter photos by category if provided
    let filteredPhotos = profile.progressPhotos;
    if (category) {
      filteredPhotos = filteredPhotos.filter(p => p.category === category);
    }

    // Sort by date
    filteredPhotos.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get before and after photos based on dates or first/last
    let beforePhoto, afterPhoto;

    if (beforeDate) {
      beforePhoto = filteredPhotos.find(
        p => new Date(p.date).toISOString().split('T')[0] === beforeDate
      );
    } else {
      // Get the first photo as "before"
      beforePhoto = filteredPhotos[0];
    }

    if (afterDate) {
      afterPhoto = filteredPhotos.find(
        p => new Date(p.date).toISOString().split('T')[0] === afterDate
      );
    } else {
      // Get the last photo as "after"
      afterPhoto = filteredPhotos[filteredPhotos.length - 1];
    }

    res.json({
      success: true,
      data: {
        before: beforePhoto || null,
        after: afterPhoto || null,
      },
    });
  } catch (error) {
    console.error('Error in getPhotoComparison:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
