const { Notification, User, Profile, Workout, Goal } = require('../models');

// @desc    Get all notifications for the user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Filter by read status if provided
    if (read !== undefined) {
      query.read = read === 'true';
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

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found',
        },
      });
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to access this notification',
        },
      });
    }

    // Mark as read
    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found',
        },
      });
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this notification',
        },
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { workoutReminders, goalMilestones, nutritionReminders } = req.body;

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

    // Update notification preferences
    if (workoutReminders !== undefined) {
      user.preferences.notifications.workoutReminders = workoutReminders;
    }

    if (goalMilestones !== undefined) {
      user.preferences.notifications.goalMilestones = goalMilestones;
    }

    if (nutritionReminders !== undefined) {
      user.preferences.notifications.nutritionReminders = nutritionReminders;
    }

    await user.save();

    res.json({
      success: true,
      data: user.preferences.notifications,
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    console.error('Error in updateNotificationPreferences:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// Utility functions for creating different types of notifications

// Create workout reminder notification
exports.createWorkoutReminder = async (userId, workoutId, scheduledTime) => {
  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      console.error('Workout not found for reminder');
      return null;
    }

    const user = await User.findById(userId);

    if (!user || !user.preferences.notifications.workoutReminders) {
      // User doesn't exist or has disabled workout reminders
      return null;
    }

    const notification = await Notification.create({
      userId,
      type: 'workout',
      title: 'Workout Reminder',
      message: `Time for your ${workout.name} workout`,
      read: false,
      actionLink: `/workouts/${workoutId}`,
      relatedId: workoutId,
    });

    return notification;
  } catch (error) {
    console.error('Error creating workout reminder:', error);
    return null;
  }
};

// Create goal achievement notification
exports.createGoalAchievement = async (userId, goalId) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      console.error('Profile not found for goal achievement');
      return null;
    }

    const goal = profile.goals.id(goalId);

    if (!goal) {
      console.error('Goal not found for achievement');
      return null;
    }

    const user = await User.findById(userId);

    if (!user || !user.preferences.notifications.goalMilestones) {
      // User doesn't exist or has disabled goal milestone notifications
      return null;
    }

    const notification = await Notification.create({
      userId,
      type: 'goal',
      title: 'Goal Achieved!',
      message: `Congratulations! You've reached your ${goal.type} goal`,
      read: false,
      actionLink: `/goals/${goalId}`,
      relatedId: goalId,
    });

    return notification;
  } catch (error) {
    console.error('Error creating goal achievement notification:', error);
    return null;
  }
};

// Create nutrition reminder notification
exports.createNutritionReminder = async userId => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.preferences.notifications.nutritionReminders) {
      // User doesn't exist or has disabled nutrition reminders
      return null;
    }

    const notification = await Notification.create({
      userId,
      type: 'nutrition',
      title: 'Nutrition Reminder',
      message: "Don't forget to log your meals for today",
      read: false,
      actionLink: '/nutrition',
      relatedId: null,
    });

    return notification;
  } catch (error) {
    console.error('Error creating nutrition reminder:', error);
    return null;
  }
};

// Create system notification (for all users or specific user)
exports.createSystemNotification = async (title, message, userId = null) => {
  try {
    // If userId is null, create notification for all users
    if (!userId) {
      // Get all users
      const users = await User.find({});

      // Create notifications in bulk
      const notifications = users.map(user => ({
        userId: user._id,
        type: 'system',
        title,
        message,
        read: false,
      }));

      await Notification.insertMany(notifications);
      return { count: notifications.length };
    } else {
      // Create notification for specific user
      const notification = await Notification.create({
        userId,
        type: 'system',
        title,
        message,
        read: false,
      });

      return notification;
    }
  } catch (error) {
    console.error('Error creating system notification:', error);
    return null;
  }
};
