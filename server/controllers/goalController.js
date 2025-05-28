const { Profile } = require('../models');

// @desc    Get all user goals
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
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
      count: profile.goals.length,
      data: profile.goals,
    });
  } catch (error) {
    console.error('Error in getGoals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    const { type, targetValue, currentValue, unit, targetDate } = req.body;

    if (!type || !targetValue || !targetDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Type, target value, and target date are required',
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

    // Create new goal
    const newGoal = {
      type,
      targetValue,
      currentValue: currentValue || 0,
      unit,
      startDate: new Date(),
      targetDate: new Date(targetDate),
      status: 'active',
    };

    // Add to goals array
    profile.goals.push(newGoal);

    // Save profile
    await profile.save();

    res.status(201).json({
      success: true,
      data: newGoal,
      message: 'Goal created successfully',
    });
  } catch (error) {
    console.error('Error in createGoal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get specific goal
// @route   GET /api/goals/:id
// @access  Private
exports.getGoal = async (req, res) => {
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

    // Find goal by ID
    const goal = profile.goals.id(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found',
        },
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error('Error in getGoal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res) => {
  try {
    const { type, targetValue, currentValue, unit, targetDate, status } =
      req.body;

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

    // Find goal index
    const goalIndex = profile.goals.findIndex(
      g => g._id.toString() === req.params.id
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found',
        },
      });
    }

    // Update goal fields
    if (type) {
      profile.goals[goalIndex].type = type;
    }
    if (targetValue !== undefined) {
      profile.goals[goalIndex].targetValue = targetValue;
    }
    if (currentValue !== undefined) {
      profile.goals[goalIndex].currentValue = currentValue;
    }
    if (unit) {
      profile.goals[goalIndex].unit = unit;
    }
    if (targetDate) {
      profile.goals[goalIndex].targetDate = new Date(targetDate);
    }
    if (status) {
      profile.goals[goalIndex].status = status;
    }

    // Auto-update status if goal is met
    if (
      profile.goals[goalIndex].currentValue >=
      profile.goals[goalIndex].targetValue
    ) {
      profile.goals[goalIndex].status = 'completed';
      profile.goals[goalIndex].completedAt = new Date();
    }

    // Save profile
    await profile.save();

    res.json({
      success: true,
      data: profile.goals[goalIndex],
      message: 'Goal updated successfully',
    });
  } catch (error) {
    console.error('Error in updateGoal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
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

    // Find goal by ID
    const goalIndex = profile.goals.findIndex(
      g => g._id.toString() === req.params.id
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found',
        },
      });
    }

    // Remove goal
    profile.goals.splice(goalIndex, 1);

    // Save profile
    await profile.save();

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteGoal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update goal progress
// @route   PATCH /api/goals/:id/progress
// @access  Private
exports.updateGoalProgress = async (req, res) => {
  try {
    const { currentValue } = req.body;

    if (currentValue === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Current value is required',
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

    // Find goal index
    const goalIndex = profile.goals.findIndex(
      g => g._id.toString() === req.params.id
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found',
        },
      });
    }

    // Update current value
    profile.goals[goalIndex].currentValue = currentValue;

    // Auto-update status if goal is met
    if (currentValue >= profile.goals[goalIndex].targetValue) {
      profile.goals[goalIndex].status = 'completed';
      profile.goals[goalIndex].completedAt = new Date();
    } else {
      // Ensure the status is active if the goal was previously completed
      if (profile.goals[goalIndex].status === 'completed') {
        profile.goals[goalIndex].status = 'active';
        profile.goals[goalIndex].completedAt = undefined;
      }
    }

    // Save profile
    await profile.save();

    res.json({
      success: true,
      data: profile.goals[goalIndex],
      message: 'Goal progress updated successfully',
    });
  } catch (error) {
    console.error('Error in updateGoalProgress:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
