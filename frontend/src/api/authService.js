import API from './api.js';
import { handleApiError } from './helpers';

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Registration failed');
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login failed');
  }
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await API.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Email verification failed');
  }
};

// Resend verification email
export const resendVerification = async (email) => {
  try {
    const response = await API.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to resend verification email');
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to send reset email');
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await API.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// Update profile
export const updateProfile = async (userData) => {
  try {
    const response = await API.put('/auth/update-profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profile update failed' };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await API.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password change failed' };
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};