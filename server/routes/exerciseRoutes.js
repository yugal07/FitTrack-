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

// All routes are protected
router.use(protect);

// Special routes
router.get('/muscle-groups/:group', getExercisesByMuscleGroup);

// Standard CRUD routes
router.route('/')
  .get(getExercises)
  .post(admin, createExercise); // Admin only

router.route('/:id')
  .get(getExercise)
  .put(admin, updateExercise) // Admin only
  .delete(admin, deleteExercise); // Admin only

// Rating route
router.post('/:id/ratings', rateExercise);

module.exports = router;