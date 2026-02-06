import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes } from '../api';
import { useAuth, useToast } from '../contexts';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Button, RecipeForm } from '../components';

const CATEGORIES = ['All', 'Salad', 'Soup', 'Main Course', 'Side Dish', 'Dessert', 'Breakfast', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function Recipes() {
  useDocumentTitle('Farm Recipes');
  useScrollToTop();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    setFilteredRecipes(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ Farm Recipes</h1>
            <p className="text-gray-600">Discover delicious recipes using fresh farm products</p>
          </div>
          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 md:mt-0"
            >
              Share Your Recipe
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="🔍 Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {DIFFICULTIES.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center overflow-hidden">
                  {recipe.image ? (
                    <img
                      src={`http://localhost:5000${recipe.image}`}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🍽️</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">{recipe.title}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {recipe.prep_time && (
                        <span>⏱️ {recipe.prep_time}m</span>
                      )}
                      {recipe.servings && (
                        <span>👥 {recipe.servings}</span>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{recipe.category}</span>
                  </div>

                  {recipe.user && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        By <span className="font-medium text-gray-700">{recipe.user.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Recipe Modal - To be implemented */}
      {showCreateModal && user && (
        <RecipeForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchRecipes();
          }}
        />
      )}
    </div>
  );
}
