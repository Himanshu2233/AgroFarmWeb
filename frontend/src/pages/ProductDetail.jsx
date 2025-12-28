import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService.js';
import { getProductRating } from '../api/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookingModal from '../components/BookingModal.jsx';
import ReviewModal from '../components/ReviewModal.jsx';
import ReviewsList from '../components/ReviewsList.jsx';
import StarRating from '../components/StarRating.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchRating();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const data = await getProductRating(id);
      setRating(data);
    } catch (error) {
      console.error('Failed to fetch rating:', error);
    }
  };

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleReviewClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowReviewModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    fetchProduct();
    alert('🎉 Booking successful!');
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    fetchRating();
    setReviewRefreshKey(prev => prev + 1);
    alert('⭐ Review submitted!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-800 text-white px-6 py-2 rounded-full"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="text-green-800 hover:text-green-600 mb-6 flex items-center gap-2"
        >
          ← Back to Products
        </button>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Emoji */}
            <div className="text-9xl text-center md:text-left">
              {product.emoji || '🌱'}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={Math.round(rating.average)} size="text-xl" />
                <span className="text-gray-600">
                  {rating.average} ({rating.count} reviews)
                </span>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-orange-500 mb-4">
                ₹{product.price} <span className="text-lg text-gray-500">{product.unit}</span>
              </p>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-4">{product.description}</p>
              )}

              {/* Stock */}
              <p className={`mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `🟢 ${product.stock} available` : '🔴 Out of stock'}
              </p>

              {/* Category */}
              <p className="text-gray-500 capitalize mb-6">
                Category: {product.category}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookClick}
                  disabled={product.stock === 0}
                  className="bg-green-800 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  📅 Book Now
                </button>
                <button
                  onClick={handleReviewClick}
                  className="border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white px-8 py-3 rounded-full font-medium transition"
                >
                  ⭐ Write Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">⭐ Customer Reviews</h2>
            <button
              onClick={handleReviewClick}
              className="text-green-800 hover:text-green-600 font-medium"
            >
              + Add Review
            </button>
          </div>
          <ReviewsList productId={product.id} refreshKey={reviewRefreshKey} />
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && (
        <BookingModal
          product={product}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          product={product}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}