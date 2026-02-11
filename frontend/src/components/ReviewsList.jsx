import { useState, useEffect, useCallback } from 'react';
import { getProductReviews, updateReview, deleteReview } from '../api/reviewService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts';
import StarRating from './StarRating';
import Modal from './Modal';

export default function ReviewsList({ productId, refreshKey = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [editLoading, setEditLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

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

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateReview(editingReview.id, editForm);
      toast.success('Review updated!');
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted!');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
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
    <>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StarRating rating={review.rating} size="small" />
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Edit/Delete for own reviews */}
                  {user && review.user_id === user.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Comment */}
                <p className="text-gray-600 text-sm sm:text-base break-words">{review.comment}</p>

                {/* Admin Reply */}
                {review.admin_reply && (
                  <div className="mt-3 ml-0 sm:ml-2 pl-3 border-l-2 border-green-300 bg-green-50 rounded-r-lg p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-green-700">🌿 Farm Response</span>
                      {review.admin_reply_at && (
                        <span className="text-xs text-green-600">• {formatDate(review.admin_reply_at)}</span>
                      )}
                    </div>
                    <p className="text-sm text-green-800">{review.admin_reply}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <Modal isOpen={true} onClose={() => setEditingReview(null)} size="default">
          <Modal.Header>
            <Modal.Title>Edit Your Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={editForm.rating}
                    onRatingChange={(rating) => setEditForm(prev => ({ ...prev, rating }))}
                    size="large"
                    interactive
                  />
                  <span className="ml-3 text-lg font-medium text-gray-700">{editForm.rating}/5</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  placeholder="Update your review..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{editForm.comment.length}/500</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingReview(null)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
