import { useState, useEffect, useCallback } from 'react';
import { getProductReviews } from '../api/reviewService';
import StarRating from './StarRating';

export default function ReviewsList({ productId, refreshKey = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">📝</div>
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {review.user?.name || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="small" />
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Comment */}
              <p className="text-gray-600">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
