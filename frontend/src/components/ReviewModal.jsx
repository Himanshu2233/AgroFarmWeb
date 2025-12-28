import { useState } from 'react';
import { createReview } from '../api/reviewService.js';
import StarRating from './StarRating.jsx';

export default function ReviewModal({ product, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await createReview({
        product_id: product.id,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-green-800 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">⭐ Write a Review</h2>
          <button onClick={onClose} className="text-2xl hover:text-green-300">×</button>
        </div>

        {/* Product Info */}
        <div className="p-4 border-b flex items-center gap-4">
          <span className="text-4xl">{product.emoji || '🌱'}</span>
          <div>
            <h3 className="font-bold text-green-800">{product.name}</h3>
            <p className="text-gray-600">₹{product.price} {product.unit}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Your Rating *</label>
            <div className="flex items-center gap-4">
              <StarRating rating={rating} onRate={setRating} size="text-3xl" editable />
              <span className="text-gray-600">
                {rating > 0 && ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Your Review (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}