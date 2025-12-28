import API from './api.js';

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
  const formData = new FormData();
  
  Object.keys(animalData).forEach(key => {
    if (animalData[key] !== null && animalData[key] !== undefined) {
      formData.append(key, animalData[key]);
    }
  });

  const response = await API.post('/animals', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Update animal with image
export const updateAnimal = async (id, animalData) => {
  const formData = new FormData();
  
  Object.keys(animalData).forEach(key => {
    if (animalData[key] !== null && animalData[key] !== undefined) {
      formData.append(key, animalData[key]);
    }
  });

  const response = await API.put(`/animals/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete animal
export const deleteAnimal = async (id) => {
  const response = await API.delete(`/animals/${id}`);
  return response.data;
};