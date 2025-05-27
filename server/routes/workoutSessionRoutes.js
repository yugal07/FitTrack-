const express = require('express');
const router = express.Router();
const {
  getWorkoutSessions,
  getWorkoutSession,
  logWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
  getWorkoutStats,
} = require('../controllers/workoutSessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Special routes
router.get('/stats', getWorkoutStats);

// Standard CRUD routes
router.route('/').get(getWorkoutSessions).post(logWorkoutSession);

router
  .route('/:id')
  .get(getWorkoutSession)
  .put(updateWorkoutSession)
  .delete(deleteWorkoutSession);

module.exports = router;
