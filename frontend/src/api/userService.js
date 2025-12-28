import API from './api.js';

// Get all users (Admin)
export const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

// Get user stats (Admin)
export const getUserStats = async () => {
  const response = await API.get('/users/stats');
  return response.data;
};

// Get single user (Admin)
export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

// Update user (Admin)
export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user (Admin)
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

// Toggle user status (Admin)
export const toggleUserStatus = async (id) => {
  const response = await API.patch(`/users/${id}/toggle-status`);
  return response.data;
};

// Change user role (Admin)
export const changeUserRole = async (id, role) => {
  const response = await API.patch(`/users/${id}/change-role`, { role });
  return response.data;
};