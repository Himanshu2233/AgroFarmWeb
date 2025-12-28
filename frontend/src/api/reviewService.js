import API from './api.js';

// Get reviews for a product
export const getProductReviews = async (productId) => {
  const response = await API.get(`/reviews/product/${productId}`);
  return response.data;
};

// Get product average rating
export const getProductRating = async (productId) => {
  const response = await API.get(`/reviews/product/${productId}/rating`);
  return response.data;
};

// Create or update review
export const createReview = async (reviewData) => {
  const response = await API.post('/reviews', reviewData);
  return response.data;
};

// Update review
export const updateReview = async (id, reviewData) => {
  const response = await API.put(`/reviews/${id}`, reviewData);
  return response.data;
};

// Delete review
export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};

// Get all reviews (admin)
export const getAllReviews = async () => {
  const response = await API.get('/reviews/all');
  return response.data;
};