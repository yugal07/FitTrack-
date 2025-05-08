import api from '../utils/api';

// Store auth tokens in localStorage
const storeTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};

// Remove auth tokens from localStorage
const removeTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Get stored token
const getToken = () => {
  return localStorage.getItem('token');
};

// Get stored refresh token
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Check if user is logged in
const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Convert to boolean
};

// Login user
const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, refreshToken } = response.data.data;
    storeTokens(token, refreshToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, refreshToken } = response.data.data;
    storeTokens(token, refreshToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
const logout = () => {
  removeTokens();
};

// Refresh access token
const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/api/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    storeTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    removeTokens();
    throw error.response?.data || error;
  }
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update password
const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/api/auth/password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const authService = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  updatePassword,
  getCurrentUser,
  isAuthenticated,
  getToken
};

export default authService;