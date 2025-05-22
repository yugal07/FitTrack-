import api from '../utils/api';

// Get admin dashboard stats
const getStats = async () => {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all users
const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user by ID
const getUserById = async userId => {
  try {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user
const deleteUser = async userId => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get platform analytics
const getAnalytics = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/analytics', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exercise management
const getExercises = async (params = {}) => {
  try {
    const response = await api.get('/api/exercises', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getExerciseById = async exerciseId => {
  try {
    const response = await api.get(`/api/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createExercise = async exerciseData => {
  try {
    const response = await api.post('/api/exercises', exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateExercise = async (exerciseId, exerciseData) => {
  try {
    const response = await api.put(
      `/api/exercises/${exerciseId}`,
      exerciseData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteExercise = async exerciseId => {
  try {
    const response = await api.delete(`/api/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Workout management
const getWorkouts = async (params = {}) => {
  try {
    const response = await api.get('/api/workouts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getWorkoutById = async workoutId => {
  try {
    const response = await api.get(`/api/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createWorkout = async workoutData => {
  try {
    const response = await api.post('/api/workouts', workoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateWorkout = async (workoutId, workoutData) => {
  try {
    const response = await api.put(`/api/workouts/${workoutId}`, workoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteWorkout = async workoutId => {
  try {
    const response = await api.delete(`/api/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Announcement management
const sendAnnouncement = async announcementData => {
  try {
    const response = await api.post(
      '/api/admin/announcements',
      announcementData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/notifications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get nutrition items with filtering
const getNutritionItems = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/nutrition', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get nutrition item by ID
const getNutritionItemById = async itemId => {
  try {
    const response = await api.get(`/api/admin/nutrition/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create nutrition item
const createNutritionItem = async itemData => {
  try {
    const response = await api.post('/api/admin/nutrition', itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update nutrition item
const updateNutritionItem = async (itemId, itemData) => {
  try {
    const response = await api.put(`/api/admin/nutrition/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete nutrition item
const deleteNutritionItem = async itemId => {
  try {
    const response = await api.delete(`/api/admin/nutrition/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const adminService = {
  getStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  sendAnnouncement,
  getNotifications,
  getNutritionItems,
  getNutritionItemById,
  createNutritionItem,
  updateNutritionItem,
  deleteNutritionItem,
};

export default adminService;
