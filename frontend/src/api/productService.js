import API from './api.js';

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
  const formData = new FormData();
  
  // Append all fields
  Object.keys(productData).forEach(key => {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  });

  const response = await API.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update product with image
export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  
  Object.keys(productData).forEach(key => {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  });

  const response = await API.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};