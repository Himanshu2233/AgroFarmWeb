import API from './api.js';
import { createFormData, FORMDATA_HEADERS } from './helpers';

// Get all animals
export const getAllAnimals = async () => {
  const response = await API.get('/animals');
  return response.data;
};

// Get single animal
export const getAnimalById = async (id) => {
  const response = await API.get(`/animals/${id}`);
  return response.data;
};

// Create animal with image
export const createAnimal = async (animalData) => {
  const formData = createFormData(animalData);
  const response = await API.post('/animals', formData, FORMDATA_HEADERS);
  return response.data;
};

// Update animal with image
export const updateAnimal = async (id, animalData) => {
  const formData = createFormData(animalData);
  const response = await API.put(`/animals/${id}`, formData, FORMDATA_HEADERS);
  return response.data;
};

// Delete animal
export const deleteAnimal = async (id) => {
  const response = await API.delete(`/animals/${id}`);
  return response.data;
};