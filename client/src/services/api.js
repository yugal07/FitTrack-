import axios from 'axios';

// Use a consistent API URL approach
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Improved request interceptor with better logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Always set the Authorization header for all requests
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`Setting auth header for ${config.url}`);
    } else {
      console.warn(`No token available for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Improved response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // If no refresh token, log the user out
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Force a redirect to login
          return Promise.reject(error);
        }
        
        // Call the refresh token endpoint with a new axios instance to avoid interceptors
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        if (response.data.success) {
          // Store the new tokens
          localStorage.setItem('token', response.data.data.accessToken);
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
          
          // Update the Authorization header for the original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.data.accessToken}`;
          
          // Update default headers for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // If refresh fails, log the user out
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Force a redirect to login
        return Promise.reject(refreshError);
      }
    }
    
    // Log detailed error info
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default api;