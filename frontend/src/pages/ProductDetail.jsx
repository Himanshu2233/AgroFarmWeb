import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService.js';
import { getProductRating } from '../api/reviewService.js';
import { useAuth } from '../context';
import { BookingModal } from '../features/bookings';
import { ReviewModal } from '../features/reviews';
import { BackButton } from '../components';
import { StarRating } from '../components/ui';
import { ReviewsList } from '../features/reviews';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    fetchRating();
    setReviewRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-green-800 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😞</span>
          </div>
          <p className="text-xl text-red-600 font-medium mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <BackButton to="/products" label="Back to Products" className="text-white/80 hover:text-white" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Product Image/Emoji */}
            <div className="md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 md:p-12">
              {product.image ? (
                <img
                  src={`${API_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-48 md:h-64 object-cover rounded-xl"
                />
              ) : (
                <span className="text-9xl">{product.emoji || '🌱'}</span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-xl">
                <StarRating rating={Math.round(rating.average)} size="text-xl" />
                <span className="text-gray-700 font-medium">
                  {rating.average.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-600">Rs. {product.price}</span>
                <span className="text-gray-500 ml-2">{product.unit}</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
              )}

              {/* Stock */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-6 ${
                product.stock > 0 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBookClick}
                  disabled={product.stock === 0}
                  className="flex-1 md:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Now
                </button>
                <button
                  onClick={handleReviewClick}
                  className="flex-1 md:flex-none bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-8 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Write Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Customer Reviews
            </h2>
            <button
              onClick={handleReviewClick}
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Review
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