import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
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
      alert('Booking cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">📅 My Bookings</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-md">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-600 mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span className="text-4xl">
                      {booking.product?.emoji || '🌱'}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-green-800">
                        {booking.product?.name || 'Product'}
                      </h3>
                      <p className="text-gray-600">
                        Quantity: {booking.quantity} {booking.product?.unit}
                      </p>
                      <p className="text-gray-600">
                        Schedule: {booking.schedule_type}
                      </p>
                      <p className="text-gray-600">
                        Start: {formatDate(booking.start_date)}
                        {booking.end_date && ` - End: ${formatDate(booking.end_date)}`}
                      </p>
                      {booking.delivery_time && (
                        <p className="text-gray-600">
                          Delivery: {booking.delivery_time}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          Notes: {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="text-xl font-bold text-green-800 mt-2">
                      ₹{booking.total_price}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {(booking.status === 'pending' || booking.status === 'approved') && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}