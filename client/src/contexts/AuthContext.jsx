// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData.data);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Token might be invalid, logout user
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      setCurrentUser(response.data);
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.error?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      setCurrentUser(response.data);
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.error?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Update user information
  const updateUser = (user) => {
    setCurrentUser(user);
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setError(null);
      return await authService.forgotPassword(email);
    } catch (err) {
      setError(err.error?.message || 'Failed to process forgot password request');
      throw err;
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      return await authService.updatePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.error?.message || 'Failed to update password');
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    changePassword,
    isAuthenticated: authService.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;