import API from './api.js';

// Get my bookings
export const getMyBookings = async () => {
  const response = await API.get('/bookings/my');
  return response.data;
};

// Create booking
export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const response = await API.put(`/bookings/${id}/cancel`);
  return response.data;
};

// Admin: Get all bookings
export const getAllBookings = async () => {
  const response = await API.get('/bookings/all');
  return response.data;
};

// Admin: Update booking status
export const updateBookingStatus = async (id, status) => {
  const response = await API.put(`/bookings/${id}/status`, { status });
  return response.data;
};