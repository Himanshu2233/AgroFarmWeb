import { useState } from 'react';
import { createReview } from '../api/reviewService';
import { useToast } from '../contexts';
import Modal from './Modal';
import StarRating from './StarRating';

export default function ReviewModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.comment.trim()) {
      setError('Please write a review comment');
      setLoading(false);
      return;
    }

    try {
      await createReview({
        product_id: product.id,
        rating: formData.rating,
        comment: formData.comment,
      });
      
      toast.success('Review submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="default">
      <Modal.Header>
        <Modal.Title>Write a Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
            <div className="text-4xl">{product.emoji || '🌱'}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-amber-600 text-sm">Share your experience with this product</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="large"
                interactive
              />
              <span className="ml-3 text-lg font-medium text-gray-700">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              placeholder="Tell us about your experience with this product..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.comment.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
