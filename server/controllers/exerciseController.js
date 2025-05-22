const { Exercise } = require('../models');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
exports.getExercises = async (req, res) => {
  try {
    const {
      muscleGroup,
      difficulty,
      search,
      equipment,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    // Filter by muscle group
    if (muscleGroup) {
      query.muscleGroups = muscleGroup;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by equipment
    if (equipment) {
      query.equipment = equipment;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await Exercise.countDocuments(query);

    // Get exercises
    const exercises = await Exercise.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ name: 1 });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      count: exercises.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      },
      data: exercises
    });
  } catch (error) {
    console.error('Error in getExercises:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Get single exercise
// @route   GET /api/exercises/:id
// @access  Private
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        }
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error in getExercise:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Create exercise (admin only)
// @route   POST /api/exercises
// @access  Private/Admin
exports.createExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      muscleGroups,
      difficulty,
      instructions,
      videoUrl,
      imageUrl,
      equipment
    } = req.body;

    // Check if exercise already exists
    const existingExercise = await Exercise.findOne({ name });

    if (existingExercise) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EXERCISE_EXISTS',
          message: 'Exercise with this name already exists'
        }
      });
    }

    // Create exercise
    const exercise = await Exercise.create({
      name,
      description,
      muscleGroups,
      difficulty,
      instructions,
      videoUrl,
      imageUrl,
      equipment
    });

    res.status(201).json({
      success: true,
      data: exercise,
      message: 'Exercise created successfully'
    });
  } catch (error) {
    console.error('Error in createExercise:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Update exercise (admin only)
// @route   PUT /api/exercises/:id
// @access  Private/Admin
exports.updateExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      muscleGroups,
      difficulty,
      instructions,
      videoUrl,
      imageUrl,
      equipment
    } = req.body;

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        }
      });
    }

    // Check if updating to an existing name
    if (name && name !== exercise.name) {
      const existingExercise = await Exercise.findOne({ name });

      if (existingExercise) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'EXERCISE_EXISTS',
            message: 'Exercise with this name already exists'
          }
        });
      }
    }

    // Update fields
    if (name) {exercise.name = name;}
    if (description) {exercise.description = description;}
    if (muscleGroups) {exercise.muscleGroups = muscleGroups;}
    if (difficulty) {exercise.difficulty = difficulty;}
    if (instructions) {exercise.instructions = instructions;}
    if (videoUrl !== undefined) {exercise.videoUrl = videoUrl;}
    if (imageUrl !== undefined) {exercise.imageUrl = imageUrl;}
    if (equipment) {exercise.equipment = equipment;}

    // Save exercise
    await exercise.save();

    res.json({
      success: true,
      data: exercise,
      message: 'Exercise updated successfully'
    });
  } catch (error) {
    console.error('Error in updateExercise:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Delete exercise (admin only)
// @route   DELETE /api/exercises/:id
// @access  Private/Admin
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        }
      });
    }

    await exercise.deleteOne();

    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteExercise:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Rate exercise
// @route   POST /api/exercises/:id/ratings
// @access  Private
exports.rateExercise = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RATING',
          message: 'Rating must be between 1 and 5'
        }
      });
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        }
      });
    }

    // Check if user already rated this exercise
    const existingRatingIndex = exercise.ratings.findIndex(
      r => r.userId.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      exercise.ratings[existingRatingIndex].rating = rating;
      exercise.ratings[existingRatingIndex].review = review || '';
      exercise.ratings[existingRatingIndex].date = Date.now();
    } else {
      // Add new rating
      exercise.ratings.push({
        userId: req.user._id,
        rating,
        review: review || '',
        date: Date.now()
      });
    }

    // Recalculate average rating
    exercise.averageRating = exercise.ratings.reduce((acc, item) => acc + item.rating, 0) / exercise.ratings.length;

    await exercise.save();

    res.json({
      success: true,
      data: {
        rating,
        review,
        averageRating: exercise.averageRating
      },
      message: 'Exercise rated successfully'
    });
  } catch (error) {
    console.error('Error in rateExercise:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// @desc    Get exercises by muscle group
// @route   GET /api/exercises/muscle-groups/:group
// @access  Private
exports.getExercisesByMuscleGroup = async (req, res) => {
  try {
    const muscleGroup = req.params.group;

    if (!muscleGroup) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Muscle group is required'
        }
      });
    }

    const exercises = await Exercise.find({ muscleGroups: muscleGroup })
      .sort({ name: 1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Error in getExercisesByMuscleGroup:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};