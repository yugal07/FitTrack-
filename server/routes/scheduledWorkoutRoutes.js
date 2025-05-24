const express = require('express');
const router = express.Router();
const { 
  getScheduledWorkouts,
  getScheduledWorkout,
  createScheduledWorkout,
  updateScheduledWorkout,
  deleteScheduledWorkout,
  completeScheduledWorkout
} = require('../controllers/scheduledWorkoutController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Standard CRUD routes
router.route('/')
  .get(getScheduledWorkouts)
  .post(createScheduledWorkout);

router.route('/:id')
  .get(getScheduledWorkout)
  .put(updateScheduledWorkout)
  .delete(deleteScheduledWorkout);

// Special routes
router.put('/:id/complete', completeScheduledWorkout);

module.exports = router;