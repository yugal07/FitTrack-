const express = require('express');
const router = express.Router();
const { 
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  updateNotificationPreferences
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all notifications
router.get('/', getNotifications);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Update notification preferences
router.put('/preferences', updateNotificationPreferences);

module.exports = router;