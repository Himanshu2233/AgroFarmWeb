import axios from 'axios';

// Use environment variable with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      // Only redirect on auth failures, not on regular 401s like login failures
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN' || errorCode === 'NO_TOKEN') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login/register page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          window.location.href = '/login?session=expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;