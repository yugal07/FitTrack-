const { WorkoutSession, Workout } = require('../models');

// @desc    Get workout session history
// @route   GET /api/workout-sessions
// @access  Private
exports.getWorkoutSessions = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await WorkoutSession.countDocuments(query);

    // Get workout sessions
    const workoutSessions = await WorkoutSession.find(query)
      .populate('workoutId', 'name type fitnessLevel')
      .populate('completedExercises.exerciseId', 'name muscleGroups')
      .skip(startIndex)
      .limit(limit)
      .sort({ date: -1 });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.json({
      success: true,
      count: workoutSessions.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
      data: workoutSessions,
    });
  } catch (error) {
    console.error('Error in getWorkoutSessions:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get specific workout session
// @route   GET /api/workout-sessions/:id
// @access  Private
exports.getWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id)
      .populate('workoutId')
      .populate('completedExercises.exerciseId');

    if (!workoutSession) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Workout session not found',
        },
      });
    }

    // Check if session belongs to user
    if (workoutSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to access this workout session',
        },
      });
    }

    res.json({
      success: true,
      data: workoutSession,
    });
  } catch (error) {
    console.error('Error in getWorkoutSession:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Log completed workout session
// @route   POST /api/workout-sessions
// @access  Private
exports.logWorkoutSession = async (req, res) => {
  try {
    const {
      workoutId,
      date,
      duration,
      completedExercises,
      caloriesBurned,
      rating,
      difficulty,
      notes,
      mood,
    } = req.body;

    // Validate workoutId
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WORKOUT_NOT_FOUND',
          message: 'Workout not found',
        },
      });
    }

    // Create workout session
    const workoutSession = await WorkoutSession.create({
      userId: req.user._id,
      workoutId,
      date: date || new Date(),
      duration,
      completedExercises,
      caloriesBurned,
      rating,
      difficulty,
      notes,
      mood,
    });

    res.status(201).json({
      success: true,
      data: workoutSession,
      message: 'Workout session logged successfully',
    });
  } catch (error) {
    console.error('Error in logWorkoutSession:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update workout session
// @route   PUT /api/workout-sessions/:id
// @access  Private
exports.updateWorkoutSession = async (req, res) => {
  try {
    const {
      date,
      duration,
      completedExercises,
      caloriesBurned,
      rating,
      difficulty,
      notes,
      mood,
    } = req.body;

    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Workout session not found',
        },
      });
    }

    // Check if session belongs to user
    if (workoutSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to update this workout session',
        },
      });
    }

    // Update fields
    if (date) {
      workoutSession.date = date;
    }
    if (duration) {
      workoutSession.duration = duration;
    }
    if (completedExercises) {
      workoutSession.completedExercises = completedExercises;
    }
    if (caloriesBurned !== undefined) {
      workoutSession.caloriesBurned = caloriesBurned;
    }
    if (rating) {
      workoutSession.rating = rating;
    }
    if (difficulty) {
      workoutSession.difficulty = difficulty;
    }
    if (notes !== undefined) {
      workoutSession.notes = notes;
    }
    if (mood) {
      workoutSession.mood = mood;
    }

    // Save changes
    await workoutSession.save();

    res.json({
      success: true,
      data: workoutSession,
      message: 'Workout session updated successfully',
    });
  } catch (error) {
    console.error('Error in updateWorkoutSession:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete workout session
// @route   DELETE /api/workout-sessions/:id
// @access  Private
exports.deleteWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Workout session not found',
        },
      });
    }

    // Check if session belongs to user
    if (workoutSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this workout session',
        },
      });
    }

    await workoutSession.deleteOne();

    res.json({
      success: true,
      message: 'Workout session deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteWorkoutSession:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get workout statistics
// @route   GET /api/workout-sessions/stats
// @access  Private
exports.getWorkoutStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date range query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) {
        dateQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateQuery.date.$lte = new Date(endDate);
      }
    }

    // Base query - user's sessions
    const baseQuery = { userId: req.user._id, ...dateQuery };

    // Total workouts
    const totalWorkouts = await WorkoutSession.countDocuments(baseQuery);

    // Total duration
    const durationResult = await WorkoutSession.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, total: { $sum: '$duration' } } },
    ]);
    const totalDuration =
      durationResult.length > 0 ? durationResult[0].total : 0;

    // Average workout duration
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    // Total calories burned
    const caloriesResult = await WorkoutSession.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } },
    ]);
    const totalCalories =
      caloriesResult.length > 0 ? caloriesResult[0].total : 0;

    // Average difficulty
    const difficultyResult = await WorkoutSession.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, avg: { $avg: '$difficulty' } } },
    ]);
    const avgDifficulty =
      difficultyResult.length > 0 ? difficultyResult[0].avg : 0;

    // Average rating
    const ratingResult = await WorkoutSession.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avgRating = ratingResult.length > 0 ? ratingResult[0].avg : 0;

    // Workouts by type
    const workoutsByType = await WorkoutSession.aggregate([
      { $match: baseQuery },
      {
        $lookup: {
          from: 'workouts',
          localField: 'workoutId',
          foreignField: '_id',
          as: 'workout',
        },
      },
      { $unwind: '$workout' },
      { $group: { _id: '$workout.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Workout frequency by day of week
    const workoutsByDay = await WorkoutSession.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map day numbers to names (1=Sunday, 2=Monday, etc.)
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const workoutFrequencyByDay = workoutsByDay.map(item => ({
      day: dayNames[item._id - 1],
      count: item.count,
    }));

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalDuration,
        avgDuration,
        totalCalories,
        avgDifficulty,
        avgRating,
        workoutsByType,
        workoutFrequencyByDay,
      },
    });
  } catch (error) {
    console.error('Error in getWorkoutStats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
