import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../../api';
import { useAuth, useToast } from '../../contexts';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { Button, BackButton, useConfirm } from '../../components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RecipeDetail() {
  useScrollToTop();
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useDocumentTitle(recipe ? recipe.title : 'Recipe Details');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await getRecipe(id);
      setRecipe(data);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      toast.error('Failed to load recipe');
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Recipe?',
      message: 'Are you sure you want to delete this recipe? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteRecipe(id);
      toast.success('Recipe deleted successfully!');
      navigate('/recipes');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast.error('Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const isOwner = user && user.id === recipe.user_id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BackButton to="/recipes" />

        {/* Hero Image */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-48 sm:h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            {recipe.image ? (
              <img
                src={`${API_URL}${recipe.image}`}
                alt={recipe.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-9xl">🍽️</span>
            )}
          </div>
        </div>

        {/* Recipe Info */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
              <p className="text-gray-600 text-sm sm:text-base">{recipe.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 sm:gap-6 py-4 border-y border-gray-200">
            {recipe.prep_time && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-500">Prep Time</p>
                  <p className="font-medium">{recipe.prep_time} min</p>
                </div>
              </div>
            )}
            {recipe.cook_time && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-xs text-gray-500">Cook Time</p>
                  <p className="font-medium">{recipe.cook_time} min</p>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-xs text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium">{recipe.category}</p>
              </div>
            </div>
          </div>

          {/* Author */}
          {recipe.user && (
            <div className="flex items-center gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {recipe.user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Recipe by</p>
                <p className="font-medium text-gray-800">{recipe.user.name}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canEdit && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="secondary"
                className="bg-red-50 text-red-600 hover:bg-red-100"
              >
                {deleting ? 'Deleting...' : 'Delete Recipe'}
              </Button>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🥬</span> Ingredients
          </h2>
          <ul className="space-y-2">
            {Array.isArray(recipe.ingredients) ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-700">{recipe.ingredients}</li>
            )}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📝</span> Instructions
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
