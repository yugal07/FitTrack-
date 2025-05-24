const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
  sendAnnouncement,
  getNotifications,
  getSystemOverview,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin privileges
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.route('/users').get(getUsers);

router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

router.get('/overview', getSystemOverview);

// Analytics
router.get('/analytics', getAnalytics);

// Announcements
router.post('/announcements', sendAnnouncement);

// Notifications
router.get('/notifications', getNotifications);

module.exports = router;
