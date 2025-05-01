// src/context/AuthContext.jsx (Updated with admin/user mode support)
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
  const [loginMode, setLoginMode] = useState('user'); // Track login mode - 'user' or 'admin'

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedLoginMode = localStorage.getItem('loginMode') || 'user';
    
    // Set login mode from storage
    setLoginMode(storedLoginMode);
    
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

  const login = async (credentials, mode = 'user') => {
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
        
        // Store login mode
        localStorage.setItem('loginMode', mode);
        setLoginMode(mode);
        
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
        
        // Set default login mode to 'user' for new registrations
        localStorage.setItem('loginMode', 'user');
        setLoginMode('user');
        
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
    localStorage.removeItem('loginMode');
    
    // Clear user data
    setCurrentUser(null);
    setLoginMode('user');
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

  // Switch between admin and user mode without logging out
  const switchLoginMode = (mode) => {
    if (mode === 'admin' || mode === 'user') {
      localStorage.setItem('loginMode', mode);
      setLoginMode(mode);
      return true;
    }
    return false;
  };

  const value = {
    currentUser,
    loading,
    error,
    loginMode,
    login,
    register,
    logout,
    forgotPassword,
    switchLoginMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};