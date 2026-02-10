import { useState, useEffect } from 'react';
import { getAllRecipes, deleteRecipe } from '../../api';
import { useToast } from '../../contexts';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { Button, BackButton, useConfirm } from '../../components';

export default function AdminRecipes() {
  useDocumentTitle('Admin - Recipes');
  useScrollToTop();
  
  const toast = useToast();
  const confirm = useConfirm();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

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

  const handleDelete = async (id, title) => {
    const confirmed = await confirm({
      title: 'Delete Recipe?',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      await deleteRecipe(id);
      toast.success('Recipe deleted successfully!');
      fetchRecipes();
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast.error('Failed to delete recipe');
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
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
        <BackButton to="/admin" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ Recipe Management</h1>
          <p className="text-gray-600">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Recipes List */}
        {recipes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No recipes yet</h3>
            <p className="text-gray-600">Recipes shared by users will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center overflow-hidden">
                    {recipe.image ? (
                      <img
                        src={`http://localhost:5000${recipe.image}`}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🍽️</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">{recipe.category}</span>
                      {recipe.prep_time && <span>⏱️ {recipe.prep_time}m prep</span>}
                      {recipe.cook_time && <span>🔥 {recipe.cook_time}m cook</span>}
                      {recipe.servings && <span>👥 {recipe.servings} servings</span>}
                    </div>

                    {recipe.user && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {recipe.user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-gray-600">
                          by <span className="font-medium">{recipe.user.name}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{recipe.user.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
                      {recipe.updatedAt !== recipe.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => window.open(`/recipes/${recipe.id}`, '_blank')}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(recipe.id, recipe.title)}
                      variant="secondary"
                      className="text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
