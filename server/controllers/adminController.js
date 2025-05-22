const {
  User,
  Exercise,
  Workout,
  WorkoutSession,
  Notification,
} = require('../models');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments();

    // Get active users (users who have logged workouts in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await WorkoutSession.distinct('userId', {
      date: { $gte: thirtyDaysAgo },
    }).then(users => users.length);

    // Get total exercises
    const totalExercises = await Exercise.countDocuments();

    // Get total workouts completed
    const totalWorkouts = await WorkoutSession.countDocuments();

    // Get recent user signups (last 5 users)
    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');

    res.json({
      success: true,
      data: {
        userCount,
        activeUsers,
        totalExercises,
        totalWorkouts,
        recentSignups,
      },
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query
    const query = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

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
      count: users.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
      data: users,
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, fitnessLevel, isActive } =
      req.body;

    const user = await User.findById(req.params.id);

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
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }
    if (role) {
      user.role = role;
    }
    if (fitnessLevel) {
      user.fitnessLevel = fitnessLevel;
    }

    // Save user
    await user.save();

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Prevent deleting the only admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'LAST_ADMIN',
            message: 'Cannot delete the last admin user',
          },
        });
      }
    }

    // Delete associated data (could be moved to pre-remove hook in User model)
    await Promise.all([
      // Delete user's profile, workout sessions, etc.
      // You would need to implement these cleanups based on your data model
    ]);

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Parse date range if provided
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // User growth over time (monthly signups)
    const userGrowth = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
    ]);

    // Workout activity
    const workoutActivity = await WorkoutSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
          avgDuration: 1,
          totalCalories: 1,
        },
      },
    ]);

    // Popular workouts
    const popularWorkouts = await WorkoutSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$workoutId',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'workouts',
          localField: '_id',
          foreignField: '_id',
          as: 'workout',
        },
      },
      { $unwind: '$workout' },
      {
        $project: {
          _id: 0,
          workoutId: '$_id',
          name: '$workout.name',
          type: '$workout.type',
          count: 1,
          avgRating: 1,
        },
      },
    ]);

    // User stats by fitness level
    const usersByFitnessLevel = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$fitnessLevel',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        userGrowth,
        workoutActivity,
        popularWorkouts,
        usersByFitnessLevel,
      },
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Send announcement to all users
// @route   POST /api/admin/announcements
// @access  Private/Admin
exports.sendAnnouncement = async (req, res) => {
  try {
    const { title, message, targetUsers } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Title and message are required',
        },
      });
    }

    const userQuery = {};

    // Target specific users if specified
    if (targetUsers) {
      if (
        targetUsers === 'beginner' ||
        targetUsers === 'intermediate' ||
        targetUsers === 'advanced'
      ) {
        userQuery.fitnessLevel = targetUsers;
      } else if (targetUsers !== 'all') {
        userQuery._id = { $in: targetUsers };
      }
    }

    // Get all targeted users
    const users = await User.find(userQuery).select('_id');

    // Create notifications for each user
    const notifications = users.map(user => ({
      userId: user._id,
      type: 'system',
      title,
      message,
      read: false,
    }));

    // Insert notifications in bulk
    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Announcement sent to ${users.length} users successfully`,
      count: users.length,
    });
  } catch (error) {
    console.error('Error in sendAnnouncement:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;

    // Build query
    const query = {};

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await Notification.countDocuments(query);

    // Get notifications
    const notifications = await Notification.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

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
      count: notifications.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
      data: notifications,
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

/**
 * Get admin system overview
 * This combines various statistics into a single API call for the admin dashboard
 */
exports.getSystemOverview = async (req, res) => {
  try {
    // Get total user count
    const userCount = await User.countDocuments();

    // Get active users (users who have logged workouts in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await WorkoutSession.distinct('userId', {
      date: { $gte: thirtyDaysAgo },
    }).then(users => users.length);

    // Get user growth by month
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
      { $limit: 12 }, // Last 12 months
    ]);

    // Get recent signups
    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');

    // Get exercise stats
    const totalExercises = await Exercise.countDocuments();
    const exercisesByMuscleGroup = await Exercise.aggregate([
      {
        $unwind: '$muscleGroups',
      },
      {
        $group: {
          _id: '$muscleGroups',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get workout stats
    const totalWorkouts = await Workout.countDocuments();
    const workoutsByType = await Workout.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get completed workout sessions
    const totalCompletedWorkouts = await WorkoutSession.countDocuments();
    const workoutActivity = await WorkoutSession.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
      { $limit: 12 }, // Last 12 months
    ]);

    // Get most popular workouts
    const popularWorkouts = await WorkoutSession.aggregate([
      {
        $group: {
          _id: '$workoutId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'workouts',
          localField: '_id',
          foreignField: '_id',
          as: 'workout',
        },
      },
      { $unwind: '$workout' },
      {
        $project: {
          _id: 0,
          name: '$workout.name',
          type: '$workout.type',
          count: 1,
        },
      },
    ]);

    // Aggregate all data
    const systemOverview = {
      users: {
        total: userCount,
        active: activeUsers,
        growth: userGrowth,
        recent: recentSignups,
      },
      exercises: {
        total: totalExercises,
        byMuscleGroup: exercisesByMuscleGroup,
      },
      workouts: {
        total: totalWorkouts,
        byType: workoutsByType,
        completed: totalCompletedWorkouts,
        activity: workoutActivity,
        popular: popularWorkouts,
      },
    };

    res.json({
      success: true,
      data: systemOverview,
    });
  } catch (error) {
    console.error('Error in getSystemOverview:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
