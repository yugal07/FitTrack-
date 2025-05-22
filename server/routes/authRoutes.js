const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updatePassword,
  forgotPassword ,
  refreshToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/password', protect, updatePassword);

module.exports = router;