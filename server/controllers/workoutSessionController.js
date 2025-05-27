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
      name,
      type,
      date,
      duration,
      completedExercises,
      caloriesBurned,
      rating,
      difficulty,
      feeling,
      notes,
      mood,
    } = req.body;

    console.log('Received workout session data:', req.body); // Debug log

    let finalWorkoutId = workoutId;

    // Handle case where no workoutId is provided (custom workout from WorkoutLogger)
    if (!workoutId && name) {
      try {
        // Create a temporary workout entry for the session
        const tempWorkout = await Workout.create({
          name: name || 'Custom Workout',
          type: type || 'custom',
          description: 'Auto-generated from workout session',
          fitnessLevel: 'intermediate',
          duration: duration || 60,
          isCustom: true,
          userId: req.user._id,
          exercises:
            completedExercises?.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              sets: 1,
              reps: 0,
              order: index + 1,
            })) || [],
        });
        finalWorkoutId = tempWorkout._id;
      } catch (workoutError) {
        console.error('Error creating temporary workout:', workoutError);
        // Continue without workoutId if creation fails
      }
    } else if (workoutId) {
      // Validate existing workoutId
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
    }

    // Create workout session
    const workoutSessionData = {
      userId: req.user._id,
      date: date || new Date(),
      duration: parseInt(duration),
      completedExercises: completedExercises || [],
      caloriesBurned: caloriesBurned || 0,
      rating: rating ? parseInt(rating) : undefined,
      difficulty:
        difficulty || feeling ? parseInt(difficulty || feeling) : undefined,
      notes: notes || '',
      mood: mood || undefined,
      name: name || '',
      type: type || 'custom',
      source: 'logger',
    };

    // Only add workoutId if we have one
    if (finalWorkoutId) {
      workoutSessionData.workoutId = finalWorkoutId;
    }

    console.log('Creating workout session with data:', workoutSessionData); // Debug log

    const workoutSession = await WorkoutSession.create(workoutSessionData);

    // Populate and return the created session
    const populatedSession = await WorkoutSession.findById(workoutSession._id)
      .populate('workoutId', 'name type fitnessLevel')
      .populate('completedExercises.exerciseId', 'name muscleGroups');

    res.status(201).json({
      success: true,
      data: populatedSession,
      message: 'Workout session logged successfully',
    });
  } catch (error) {
    console.error('Error in logWorkoutSession:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
        details: error.message,
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
      name,
      type,
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
    if (name !== undefined) {
      workoutSession.name = name;
    }
    if (type) {
      workoutSession.type = type;
    }

    // Save changes
    await workoutSession.save();

    // Populate and return updated session
    const populatedSession = await WorkoutSession.findById(workoutSession._id)
      .populate('workoutId', 'name type fitnessLevel')
      .populate('completedExercises.exerciseId', 'name muscleGroups');

    res.json({
      success: true,
      data: populatedSession,
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
    const { startDate, endDate, period = '30' } = req.query;

    // Build date range query
    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last X days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      dateQuery.date = { $gte: daysAgo };
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
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

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
      { $match: { difficulty: { $exists: true, $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$difficulty' } } },
    ]);
    const avgDifficulty =
      difficultyResult.length > 0
        ? Math.round(difficultyResult[0].avg * 10) / 10
        : 0;

    // Average rating
    const ratingResult = await WorkoutSession.aggregate([
      { $match: baseQuery },
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avgRating =
      ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    // Workouts by type (handle both session type and workout type)
    const workoutsByType = await WorkoutSession.aggregate([
      { $match: baseQuery },
      {
        $addFields: {
          workoutType: {
            $cond: {
              if: { $ne: ['$type', null] },
              then: '$type',
              else: 'custom',
            },
          },
        },
      },
      { $group: { _id: '$workoutType', count: { $sum: 1 } } },
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

    // Weekly trend (last 8 weeks)
    const weeklyTrend = await WorkoutSession.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            week: { $week: '$date' },
            year: { $year: '$date' },
          },
          workouts: { $sum: 1 },
          duration: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

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
        weeklyTrend,
        period: parseInt(period),
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
