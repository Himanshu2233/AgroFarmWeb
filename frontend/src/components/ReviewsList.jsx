import { useState, useEffect, useCallback } from 'react';
import { getProductReviews, deleteReview } from '../api/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';

export default function ReviewsList({ productId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (error) {
      alert('Failed to delete review');
      console.error('Failed to delete review:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <p className="text-gray-500">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-800">
                  👤 {review.user?.name || 'Anonymous'}
                </span>
                <StarRating rating={review.rating} size="text-sm" />
              </div>
              <p className="text-gray-600 mt-2">{review.comment || 'No comment'}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt)}</p>
            </div>

            {user && (user.id === review.user_id || user.role === 'admin') && (
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}