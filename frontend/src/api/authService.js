import API from './api.js';

// Register user
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};