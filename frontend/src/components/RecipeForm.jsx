import { useState, useEffect, useRef } from 'react';
import { createRecipe, updateRecipe } from '../api';
import { useToast } from '../contexts';
import Modal from './Modal';
import Button from './Button';

const CATEGORIES = ['Salad', 'Soup', 'Main Course', 'Side Dish', 'Dessert', 'Breakfast', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function RecipeForm({ recipe, onClose, onSuccess }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prep_time: '',
    cook_time: '',
    servings: 4,
    category: 'Other',
    difficulty: 'Medium',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: Array.isArray(recipe.ingredients) 
          ? recipe.ingredients.join('\n') 
          : recipe.ingredients || '',
        instructions: recipe.instructions || '',
        prep_time: recipe.prep_time || '',
        cook_time: recipe.cook_time || '',
        servings: recipe.servings || 4,
        category: recipe.category || 'Other',
        difficulty: recipe.difficulty || 'Medium',
        image: null
      });
      if (recipe.image) {
        setImagePreview(`http://localhost:5000${recipe.image}`);
      }
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0);
      
      const submitData = {
        ...formData,
        ingredients: ingredientsArray
      };

      if (recipe) {
        await updateRecipe(recipe.id, submitData);
        toast.success('Recipe updated successfully!');
      } else {
        await createRecipe(submitData);
        toast.success('Recipe created successfully!');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Recipe form error:', error);
      toast.error(error.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="large">
      <Modal.Header>
        <Modal.Title>{recipe ? 'Edit Recipe' : 'Share Your Recipe'}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Fresh Garden Salad"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Brief description of your recipe..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {DIFFICULTIES.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                name="prep_time"
                value={formData.prep_time}
                onChange={handleChange}
                min="0"
                placeholder="15"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                name="cook_time"
                value={formData.cook_time}
                onChange={handleChange}
                min="0"
                placeholder="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients * (one per line)
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={6}
              placeholder="2 cups fresh spinach&#10;1 cucumber, diced&#10;1 tomato, chopped&#10;1/4 cup olive oil&#10;Salt and pepper to taste"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm ${
                errors.ingredients ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={8}
              placeholder="1. Wash and prepare all vegetables&#10;2. Combine spinach, cucumber, and tomato in a large bowl&#10;3. Drizzle with olive oil&#10;4. Season with salt and pepper&#10;5. Toss well and serve immediately"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 resize-none ${
                errors.instructions ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Share Recipe'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
