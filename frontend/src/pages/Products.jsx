import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../api/productService.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookingModal from '../components/BookingModal.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (e, product) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleBookingSuccess = () => {
    setShowModal(false);
    setSelectedProduct(null);
    fetchProducts();
    alert('🎉 Booking successful!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌾</div>
          <p className="text-xl text-green-800">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😞</div>
          <p className="text-xl text-red-600">{error}</p>
          <button onClick={fetchProducts} className="mt-4 bg-green-800 text-white px-6 py-2 rounded-full">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-2">🥬 Today's Fresh Products</h1>
        <p className="text-gray-600 mb-8">Click on any product to see reviews and details</p>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-600">No products available right now</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleCardClick(product.id)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Product Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={`${API_URL}${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  ) : (
                    <span className="text-6xl">{product.emoji || '🌱'}</span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-green-800">{product.name}</h3>
                  <p className="text-gray-600">₹{product.price} {product.unit}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  )}
                  <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `🟢 ${product.stock} available` : '🔴 Out of stock'}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => handleBookClick(e, product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-green-800 hover:bg-green-700 text-white py-2 rounded-full transition disabled:bg-gray-400"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(product.id);
                      }}
                      className="px-4 py-2 border-2 border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedProduct && (
        <BookingModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}