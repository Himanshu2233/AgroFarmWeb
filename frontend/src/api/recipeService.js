import API from './api.js';

// Get all recipes
export const getAllRecipes = async (params = {}) => {
  const response = await API.get('/recipes', { params });
  return response.data;
};

// Get single recipe
export const getRecipe = async (id) => {
  const response = await API.get(`/recipes/${id}`);
  return response.data;
};

// Create recipe
export const createRecipe = async (recipeData) => {
  const formData = new FormData();
  
  Object.keys(recipeData).forEach(key => {
    if (key === 'ingredients' && Array.isArray(recipeData[key])) {
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
      formData.append(key, recipeData[key]);
    }
  });
  
  const response = await API.post('/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Update recipe
export const updateRecipe = async (id, recipeData) => {
  const formData = new FormData();
  
  Object.keys(recipeData).forEach(key => {
    if (key === 'ingredients' && Array.isArray(recipeData[key])) {
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
      formData.append(key, recipeData[key]);
    }
  });
  
  const response = await API.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Delete recipe
export const deleteRecipe = async (id) => {
  const response = await API.delete(`/recipes/${id}`);
  return response.data;
};

// Get user's recipes
export const getUserRecipes = async () => {
  const response = await API.get('/recipes/user/my-recipes');
  return response.data;
};
