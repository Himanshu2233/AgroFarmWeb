import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/bookingService.js';
import BackButton from '../../components/common/BackButton.jsx';
import { OrderDetailsModal } from '../../features/bookings';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

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
    } catch (error) {
      alert('Failed to update status');
      console.error(error);
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

  const filteredBookings = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => typeFilter === 'all' || b.booking_type === typeFilter);

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    products: bookings.filter(b => b.booking_type !== 'animal').length,
    animals: bookings.filter(b => b.booking_type === 'animal').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-blue-800 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/admin" label="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {stats.pending} Pending
            </span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {stats.active} Active
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-gray-500 text-sm">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
                <p className="text-gray-500 text-sm">Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🐄</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.animals}</p>
                <p className="text-gray-500 text-sm">Animals</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                typeFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 All ({bookings.length})
            </button>
            <button
              onClick={() => setTypeFilter('product')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                typeFilter === 'product'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌱 Products ({stats.products})
            </button>
            <button
              onClick={() => setTypeFilter('animal')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                typeFilter === 'animal'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🐄 Animals ({stats.animals})
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'active', 'completed', 'cancelled'].map((status) => {
              const count = status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length;
              const config = status !== 'all' ? getStatusConfig(status) : null;
              
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl capitalize font-medium transition-all flex items-center gap-2 ${
                    filter === status
                      ? 'bg-gray-800 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {config && <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>}
                  {status} ({count})
                </button>
              );
            })}
          </div>
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
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer group ${isAnimal ? 'border-l-4 border-l-orange-500' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Item Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform ${
                        isAnimal 
                          ? 'bg-gradient-to-br from-orange-100 to-amber-100' 
                          : 'bg-gradient-to-br from-green-100 to-emerald-100'
                      }`}>
                        {item?.emoji || (isAnimal ? '🐄' : '🌱')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                            {item?.name || (isAnimal ? 'Animal' : 'Product')}
                          </h3>
                          {isAnimal && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                              Animal Enquiry
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm mt-1 space-y-0.5">
                          <p>Qty: {booking.quantity} {!isAnimal && booking.product?.unit}</p>
                          <p>{isAnimal ? 'Visit' : 'Start'}: {formatDate(booking.start_date)}</p>
                          {!isAnimal && booking.end_date && (
                            <p>End: {formatDate(booking.end_date)}</p>
                          )}
                          {booking.delivery_time && <p>Time: <span className="capitalize">{booking.delivery_time}</span></p>}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl lg:min-w-[220px]">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {booking.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{booking.user?.name}</p>
                        <p className="text-gray-500 text-xs truncate">{booking.user?.phone || booking.user?.email}</p>
                        {booking.user?.address && (
                          <p className="text-gray-400 text-xs truncate" title={booking.user.address}>📍 {booking.user.address}</p>
                        )}
                      </div>
                    </div>

                    {/* Price & Status */}
                    <div className="text-right lg:min-w-[140px]">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                        {statusConfig.label}
                      </div>
                      <p className="text-xl font-bold text-gray-800 mt-2">
                        Rs. {Number(booking.total_price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <p className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-blue-600 transition-colors mr-auto">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Click for details
                    </p>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'approved'); }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {isAnimal ? 'Confirm Visit' : 'Approve'}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'cancelled'); }}
                              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all border border-red-200 flex items-center gap-1.5"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'approved' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'active'); }}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {isAnimal ? 'Customer Visited' : 'Start Delivery'}
                          </button>
                        )}
                        {booking.status === 'active' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'completed'); }}
                            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {isAnimal ? 'Sale Complete' : 'Mark Complete'}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-gray-400 text-sm hidden md:inline">Change:</span>
                      <select
                        value={booking.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.value !== booking.status) {
                            if (confirm(`Change status to "${e.target.value}"?`)) {
                              handleStatusUpdate(booking.id, e.target.value);
                            } else {
                              e.target.value = booking.status;
                            }
                          }
                        }}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="approved">✅ Approved</option>
                        <option value="active">🚀 Active</option>
                        <option value="completed">✓ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedBooking && (
        <OrderDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          isAdmin={true}
          onStatusUpdate={async (id, status) => {
            await handleStatusUpdate(id, status);
            // Update the selected booking in place
            setSelectedBooking(prev => prev ? { ...prev, status } : null);
          }}
        />
      )}
    </div>
  );
}