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
            console.log('User data loaded:', response.data);
          } else {
            // Token invalid, log out
            console.error('Invalid token, logging out:', response.error);
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
        console.log('Login successful. Setting user data:', response.data);
        
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Set user data
        setCurrentUser(response.data);
        return response.data;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (error) {
      console.error('Login error in context:', error);
      const errorMessage = error.message || 'An error occurred during login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('Registration successful. Setting user data:', response.data);
        
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Set user data
        setCurrentUser(response.data);
        return response.data;
      } else {
        setError(response.error.message);
        return null;
      }
    } catch (error) {
      console.error('Registration error in context:', error);
      const errorMessage = error.message || 'An error occurred during registration';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = error.message || 'An error occurred while processing your request';
      setError(errorMessage);
      throw new Error(errorMessage);
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