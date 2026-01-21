import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api/bookingService.js';
import { useAuth } from '../context';
import { BackButton } from '../components';
import { OrderDetailsModal } from '../features/bookings';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      navigate('/admin/bookings');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(id);
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Pending' },
      approved: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Approved' },
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Active' },
      completed: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', label: 'Completed' },
      cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'Cancelled' }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-green-800 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <BackButton label="Back" className="text-white/80 hover:text-white mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📅</span>
            <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
          </div>
          <p className="text-green-100 text-lg">Track and manage your bookings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start ordering fresh farm products!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>🥬</span> Browse Products
              </button>
              <button
                onClick={() => navigate('/animals')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>🐄</span> View Animals
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'approved', 'active', 'completed', 'cancelled'].map((status) => {
                const count = status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-xl capitalize font-medium transition-all ${
                      filter === status
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => {
                const isAnimal = booking.booking_type === 'animal';
                const item = isAnimal ? booking.animal : booking.product;
                const statusConfig = getStatusConfig(booking.status);
                
                return (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer group ${isAnimal ? 'border-l-4 border-l-orange-500' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Item Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-105 transition-transform ${
                            isAnimal 
                              ? 'bg-gradient-to-br from-orange-100 to-amber-100' 
                              : 'bg-gradient-to-br from-green-100 to-emerald-100'
                          }`}>
                            {item?.emoji || (isAnimal ? '🐄' : '🌱')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-gray-800 text-lg group-hover:text-green-600 transition-colors">
                                {item?.name || (isAnimal ? 'Animal' : 'Product')}
                              </h3>
                              {isAnimal && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                  Animal Enquiry
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-sm space-y-1">
                              <p>Quantity: {booking.quantity} {!isAnimal && booking.product?.unit}</p>
                              <p>{isAnimal ? 'Visit Date' : 'Start'}: {formatDate(booking.start_date)}</p>
                              {!isAnimal && booking.end_date && (
                                <p>End: {formatDate(booking.end_date)}</p>
                              )}
                              {booking.delivery_time && (
                                <p>{isAnimal ? 'Contact Time' : 'Delivery'}: <span className="capitalize">{booking.delivery_time}</span></p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status & Price */}
                        <div className="text-right md:min-w-[140px]">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                            {statusConfig.label}
                          </div>
                          <p className="text-2xl font-bold text-gray-800 mt-2">
                            Rs. {Number(booking.total_price).toLocaleString()}
                          </p>
                          {isAnimal && (
                            <p className="text-xs text-gray-500">Estimated price</p>
                          )}
                        </div>
                      </div>

                      {/* Click to view hint & Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-green-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Click to view details
                        </p>
                        
                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(booking.id);
                            }}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📭</span>
                </div>
                <p className="text-gray-500">No {filter} bookings found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedBooking && (
        <OrderDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          isAdmin={false}
        />
      )}
    </div>
  );
}