// src/services/userService.js
import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users', userData);
    return response.data;
  },
  
  updatePreferences: async (preferences) => {
    const response = await api.patch('/users/preferences', preferences);
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/users');
    return response.data;
  },
};