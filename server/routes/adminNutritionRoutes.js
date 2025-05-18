const express = require('express');
const router = express.Router();
const { 
  getNutritionItems,
  getNutritionItem,
  createNutritionItem,
  updateNutritionItem,
  deleteNutritionItem
} = require('../controllers/nutritionDatabaseController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin privileges
router.use(protect, admin);

// Nutrition management routes
router.route('/')
  .get(getNutritionItems)
  .post(createNutritionItem);

router.route('/:id')
  .get(getNutritionItem)
  .put(updateNutritionItem)
  .delete(deleteNutritionItem);

module.exports = router;