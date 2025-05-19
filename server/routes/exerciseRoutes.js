const express = require('express');
const router = express.Router();
const { 
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  rateExercise,
  getExercisesByMuscleGroup
} = require('../controllers/exerciseController');
const { protect, admin } = require('../middleware/authMiddleware');

// Special routes
router.get('/muscle-groups/:group', protect, getExercisesByMuscleGroup);

// Standard CRUD routes
router.route('/')
  .get(protect, getExercises)
  .post(protect, admin, createExercise); // Admin only

router.route('/:id')
  .get(protect, getExercise)
  .put(protect, admin, updateExercise) // Admin only
  .delete(protect, admin, deleteExercise); // Admin only

// Rating route
router.post('/:id/ratings', protect, rateExercise);

module.exports = router;