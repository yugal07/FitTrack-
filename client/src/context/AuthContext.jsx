// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Fetch current user data
      const fetchCurrentUser = async () => {
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data);
          } else {
            // Token invalid, log out
            logout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout();
        } finally {
          setLoading(false);
        }
      };
      
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Set user data
        setCurrentUser(response.data);
        return response.data;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (error) {
      setError(error.response?.data?.error?.message || 'An error occurred during login');
      throw error;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set user data
        setCurrentUser(response.data);
        return response.data;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (error) {
      setError(error.response?.data?.error?.message || 'An error occurred during registration');
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Clear user data
    setCurrentUser(null);
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      return response.success;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'An error occurred while processing your request');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};