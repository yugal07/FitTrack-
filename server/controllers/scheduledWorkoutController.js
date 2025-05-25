const asyncHandler = require('express-async-handler');
const { ScheduledWorkout, Workout } = require('../models');

// @desc    Get upcoming scheduled workouts
// @route   GET /api/scheduled-workouts
// @access  Private
const getScheduledWorkouts = asyncHandler(async (req, res) => {
  const { limit, completed } = req.query;

  // Create the query object
  const query = { user: req.user.id };

  // Filter by completion status if specified
  if (completed !== undefined) {
    query.isCompleted = completed === 'true';
  }

  // For upcoming workouts, we only want those scheduled for today or later
  if (completed !== 'true') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.scheduledFor = { $gte: today };
  }

  // Get workouts sorted by scheduled date (ascending for upcoming, descending for past)
  const sortOrder = completed === 'true' ? -1 : 1;

  const scheduledWorkouts = await ScheduledWorkout.find(query)
    .sort({ scheduledFor: sortOrder })
    .populate({
      path: 'workoutId',
      select: 'name type duration fitnessLevel description exercises',
      populate: {
        path: 'exercises.exerciseId',
        model: 'Exercise',
        select: 'name category muscleGroups instructions description',
      },
    })
    .populate('workoutSessionId', 'date duration rating')
    .limit(limit ? parseInt(limit) : undefined);

  res.status(200).json({
    success: true,
    count: scheduledWorkouts.length,
    data: scheduledWorkouts,
  });
});

// @desc    Get a single scheduled workout
// @route   GET /api/scheduled-workouts/:id
// @access  Private
const getScheduledWorkout = asyncHandler(async (req, res) => {
  const scheduledWorkout = await ScheduledWorkout.findById(req.params.id)
    .populate({
      path: 'workoutId',
      select: 'name type description fitnessLevel duration exercises',
      populate: {
        path: 'exercises.exerciseId',
        model: 'Exercise',
        select: 'name category muscleGroups instructions description',
      },
    })
    .populate('workoutSessionId', 'date duration rating difficulty notes');

  if (!scheduledWorkout) {
    res.status(404);
    throw new Error('Scheduled workout not found');
  }

  // Make sure the scheduled workout belongs to the logged in user
  if (scheduledWorkout.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this scheduled workout');
  }

  res.status(200).json({
    success: true,
    data: scheduledWorkout,
  });
});

// @desc    Create a new scheduled workout
// @route   POST /api/scheduled-workouts
// @access  Private
const createScheduledWorkout = asyncHandler(async (req, res) => {
  const { workoutId, scheduledFor, notes } = req.body;

  // Validate that the workout exists
  const workout = await Workout.findById(workoutId);
  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  // Validate scheduled time is in the future
  const scheduledDate = new Date(scheduledFor);
  if (scheduledDate <= new Date()) {
    res.status(400);
    throw new Error('Scheduled time must be in the future');
  }

  // Create the scheduled workout
  const scheduledWorkout = await ScheduledWorkout.create({
    user: req.user.id,
    workoutId,
    name: workout.name,
    scheduledFor: scheduledDate,
    duration: workout.duration,
    notes,
    isCompleted: false,
  });

  // Populate and return
  const populatedScheduledWorkout = await ScheduledWorkout.findById(
    scheduledWorkout._id
  ).populate({
    path: 'workoutId',
    select: 'name type description fitnessLevel duration',
    populate: {
      path: 'exercises.exerciseId',
      model: 'Exercise',
      select: 'name category',
    },
  });

  res.status(201).json({
    success: true,
    data: populatedScheduledWorkout,
  });
});

// @desc    Update a scheduled workout
// @route   PUT /api/scheduled-workouts/:id
// @access  Private
const updateScheduledWorkout = asyncHandler(async (req, res) => {
  let scheduledWorkout = await ScheduledWorkout.findById(req.params.id);

  if (!scheduledWorkout) {
    res.status(404);
    throw new Error('Scheduled workout not found');
  }

  // Make sure the scheduled workout belongs to the logged in user
  if (scheduledWorkout.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this scheduled workout');
  }

  // If updating workoutId, verify the workout exists and update the name
  if (req.body.workoutId) {
    const workout = await Workout.findById(req.body.workoutId);
    if (!workout) {
      res.status(404);
      throw new Error('Workout not found');
    }
    req.body.name = workout.name;
    req.body.duration = workout.duration;
  }

  // Validate scheduled time is in the future (if updating and not completed)
  if (req.body.scheduledFor && !req.body.isCompleted) {
    const newScheduledDate = new Date(req.body.scheduledFor);
    if (newScheduledDate <= new Date()) {
      res.status(400);
      throw new Error('Scheduled time must be in the future');
    }
  }

  // Update the workout
  scheduledWorkout = await ScheduledWorkout.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate({
      path: 'workoutId',
      select: 'name type description fitnessLevel duration',
      populate: {
        path: 'exercises.exerciseId',
        model: 'Exercise',
        select: 'name category muscleGroups',
      },
    })
    .populate('workoutSessionId', 'date duration rating');

  res.status(200).json({
    success: true,
    data: scheduledWorkout,
  });
});

// @desc    Delete a scheduled workout
// @route   DELETE /api/scheduled-workouts/:id
// @access  Private
const deleteScheduledWorkout = asyncHandler(async (req, res) => {
  const scheduledWorkout = await ScheduledWorkout.findById(req.params.id);

  if (!scheduledWorkout) {
    res.status(404);
    throw new Error('Scheduled workout not found');
  }

  // Make sure the scheduled workout belongs to the logged in user
  if (scheduledWorkout.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this scheduled workout');
  }

  await scheduledWorkout.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Mark a scheduled workout as completed with session ID
// @route   PUT /api/scheduled-workouts/:id/complete
// @access  Private
const completeScheduledWorkout = asyncHandler(async (req, res) => {
  const { workoutSessionId } = req.body;

  if (!workoutSessionId) {
    res.status(400);
    throw new Error('Workout session ID is required');
  }

  let scheduledWorkout = await ScheduledWorkout.findById(req.params.id);

  if (!scheduledWorkout) {
    res.status(404);
    throw new Error('Scheduled workout not found');
  }

  // Make sure the scheduled workout belongs to the logged in user
  if (scheduledWorkout.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this scheduled workout');
  }

  // Update the workout to mark as completed
  scheduledWorkout = await ScheduledWorkout.findByIdAndUpdate(
    req.params.id,
    {
      isCompleted: true,
      workoutSessionId,
      completedAt: new Date(),
    },
    { new: true, runValidators: true }
  )
    .populate({
      path: 'workoutId',
      select: 'name type description fitnessLevel duration',
    })
    .populate('workoutSessionId', 'date duration rating');

  res.status(200).json({
    success: true,
    data: scheduledWorkout,
  });
});

// @desc    Get upcoming scheduled workouts (for dashboard)
// @route   GET /api/scheduled-workouts/upcoming
// @access  Private
const getUpcomingWorkouts = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const upcomingWorkouts = await ScheduledWorkout.find({
    user: req.user.id,
    isCompleted: false,
    scheduledFor: { $gte: new Date() },
  })
    .populate({
      path: 'workoutId',
      select: 'name type duration',
    })
    .sort({ scheduledFor: 1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: upcomingWorkouts,
  });
});

module.exports = {
  getScheduledWorkouts,
  getScheduledWorkout,
  createScheduledWorkout,
  updateScheduledWorkout,
  deleteScheduledWorkout,
  completeScheduledWorkout,
  getUpcomingWorkouts,
};
