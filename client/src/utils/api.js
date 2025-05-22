import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Create a function that returns an API instance with toast notifications
const apiWithToast = toast => {
  // Handle token refresh on 401 errors and add toast notifications
  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Handle token refresh for 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });

          // Store new tokens
          localStorage.setItem('token', response.data.data.accessToken);
          localStorage.setItem('refreshToken', response.data.data.refreshToken);

          // Retry original request with new token
          originalRequest.headers['Authorization'] =
            `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');

          // Show token expired toast
          if (toast) {
            toast.error('Your session has expired. Please log in again.');
          }

          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors with appropriate toast messages if toast is available
      if (toast) {
        const { response } = error;

        if (!response) {
          toast.error('Network error. Please check your connection.');
        } else {
          // Handle different HTTP error status codes
          switch (response.status) {
            case 400:
              toast.error(
                response.data.message ||
                  'Invalid request. Please check your data.'
              );
              break;
            case 401:
              // Already handled above for token refresh
              break;
            case 403:
              toast.error('You do not have permission to perform this action.');
              break;
            case 404:
              toast.error('The requested resource was not found.');
              break;
            case 422:
              toast.error(
                response.data.message ||
                  'Validation error. Please check your data.'
              );
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error('Something went wrong. Please try again.');
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Original api without toast functionality for backward compatibility
export default api;

// Export the toast-enabled version
export { apiWithToast };
