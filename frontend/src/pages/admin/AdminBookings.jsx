import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/bookingService.js';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
      alert('Status updated!');
    } catch (error) {
      alert('Failed to update status');
        console.error(error);
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

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">📅 Manage Bookings</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'approved', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full capitalize transition ${
                filter === status
                  ? 'bg-green-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap justify-between gap-4">
                {/* Product & User Info */}
                <div className="flex gap-4">
                  <span className="text-4xl">{booking.product?.emoji || '🌱'}</span>
                  <div>
                    <h3 className="font-bold text-green-800">
                      {booking.product?.name || 'Product'}
                    </h3>
                    <p className="text-gray-600">
                      Qty: {booking.quantity} {booking.product?.unit}
                    </p>
                    <p className="text-gray-600">
                      Schedule: {booking.schedule_type}
                    </p>
                    <p className="text-gray-600">
                      Date: {formatDate(booking.start_date)}
                      {booking.end_date && ` - ${formatDate(booking.end_date)}`}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="text-right md:text-left">
                  <p className="font-medium">👤 {booking.user?.name}</p>
                  <p className="text-gray-600 text-sm">{booking.user?.email}</p>
                  <p className="text-gray-600 text-sm">{booking.user?.phone}</p>
                </div>

                {/* Price & Status */}
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
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'approved')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'active')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                    >
                      🚀 Start Delivery
                    </button>
                  )}
                  {booking.status === 'active' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-full text-sm"
                    >
                      ✓ Mark Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
            No bookings found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}