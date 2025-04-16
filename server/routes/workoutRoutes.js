const express = require('express');
const router = express.Router();
const { 
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  rateWorkout,
  getRecommendedWorkouts
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Special routes
router.get('/recommended', getRecommendedWorkouts);

// Standard CRUD routes
router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

router.route('/:id')
  .get(getWorkout)
  .put(updateWorkout)
  .delete(deleteWorkout);

// Rating route
router.post('/:id/ratings', rateWorkout);

module.exports = router;

