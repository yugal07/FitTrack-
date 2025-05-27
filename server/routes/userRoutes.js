const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  deleteUserAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserAccount);

router.patch('/preferences', updateUserPreferences);

module.exports = router;
