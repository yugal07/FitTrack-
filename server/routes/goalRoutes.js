const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  getGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Standard CRUD routes
router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

// Progress update route
router.patch('/:id/progress', updateGoalProgress);

module.exports = router;