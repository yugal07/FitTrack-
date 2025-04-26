// src/services/authService.js
import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Login failed. Please check your credentials.'
        }
      };
    }
  },
  
  register: async (userData) => {
    try {
      // Remove confirmPassword field as it's not needed in the backend
      const { confirmPassword, ...userDataToSend } = userData;
      
      const response = await api.post('/auth/register', userDataToSend);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Registration failed. Please try again.'
        }
      };
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to process your request.'
        }
      };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || 'Failed to retrieve user data.'
        }
      };
    }
  },
};