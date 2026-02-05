import API from './api.js';
import { createFormData, FORMDATA_HEADERS } from './helpers';

// Get all products
export const getAllProducts = async () => {
  const response = await API.get('/products');
  return response.data;
};

// Get single product
export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// Create product with image
export const createProduct = async (productData) => {
  const formData = createFormData(productData);
  const response = await API.post('/products', formData, FORMDATA_HEADERS);
  return response.data;
};

// Update product with image
export const updateProduct = async (id, productData) => {
  const formData = createFormData(productData);
  const response = await API.put(`/products/${id}`, formData, FORMDATA_HEADERS);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};