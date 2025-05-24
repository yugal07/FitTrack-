import api from '../utils/api';

// Get all notifications with optional filters
const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get unread notification count
const getUnreadCount = async () => {
  try {
    const response = await api.get('/api/notifications', {
      params: { read: false, limit: 1 },
    });
    return response.data.pagination.total;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark notification as read
const markAsRead = async notificationId => {
  try {
    const response = await api.patch(
      `/api/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    const response = await api.patch('/api/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete notification
const deleteNotification = async notificationId => {
  try {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update notification preferences
const updatePreferences = async preferences => {
  try {
    const response = await api.put(
      '/api/notifications/preferences',
      preferences
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  updatePreferences,
};

export default notificationService;
