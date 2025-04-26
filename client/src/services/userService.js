// src/services/userService.js
import api from './api';

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/users');
      console.log('Profile API response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to fetch profile data.'
        }
      };
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users', userData);
      console.log('Update profile API response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to update profile.'
        }
      };
    }
  },
  
  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch('/users/preferences', preferences);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to update preferences.'
        }
      };
    }
  },
  
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to delete account.'
        }
      };
    }
  },
  
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/uploads/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to upload profile picture.'
        }
      };
    }
  }
};