import { useState } from 'react';
import Modal from './Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OrderDetailsModal({ booking, onClose, isAdmin = false, onStatusUpdate }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const isAnimal = booking.booking_type === 'animal';
  const item = isAnimal ? booking.animal : booking.product;

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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-NP', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(booking.status);

  const handleStatusChange = async (newStatus) => {
    if (!onStatusUpdate) return;
    setUpdatingStatus(true);
    try {
      await onStatusUpdate(booking.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const availableStatuses = ['pending', 'approved', 'active', 'completed', 'cancelled'];

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <Modal.Header>
        <Modal.Title>
          {isAnimal ? 'Animal Enquiry Details' : 'Booking Details'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {/* Item Info */}
          <div className={`flex items-center gap-4 p-5 rounded-xl ${
            isAnimal 
              ? 'bg-gradient-to-r from-orange-50 to-amber-50' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50'
          }`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden ${
              isAnimal 
                ? 'bg-gradient-to-br from-orange-100 to-amber-100' 
                : 'bg-gradient-to-br from-green-100 to-emerald-100'
            }`}>
              {item?.image ? (
                <img src={`${API_URL}${item.image}`} alt={item.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-5xl">{item?.emoji || (isAnimal ? '🐄' : '🌱')}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {item?.name || (isAnimal ? 'Animal' : 'Product')}
                </h3>
                {isAnimal && (
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                    Animal Enquiry
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600">
                Price: <span className="font-semibold text-gray-800">Rs. {Number(item?.price || 0).toLocaleString()}</span>
                {!isAnimal && ` / ${item?.unit || 'unit'}`}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                <span className="font-bold">{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {isAnimal ? 'Enquiry Information' : 'Booking Information'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Booking ID</p>
                <p className="font-semibold text-gray-800">#{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Quantity</p>
                <p className="font-semibold text-gray-800">
                  {booking.quantity} {!isAnimal && (item?.unit || 'unit')}
                </p>
              </div>
              {!isAnimal && booking.schedule_type && booking.schedule_type !== 'once' && (
                <div>
                  <p className="text-gray-500 text-sm">Schedule</p>
                  <p className="font-semibold text-gray-800 capitalize">{booking.schedule_type}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm">{isAnimal ? 'Visit Date' : 'Start Date'}</p>
                <p className="font-semibold text-gray-800">{formatDate(booking.start_date)}</p>
              </div>
              {!isAnimal && booking.end_date && (
                <div>
                  <p className="text-gray-500 text-sm">End Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(booking.end_date)}</p>
                </div>
              )}
              {booking.delivery_time && (
                <div>
                  <p className="text-gray-500 text-sm">{isAnimal ? 'Preferred Time' : 'Delivery Time'}</p>
                  <p className="font-semibold text-gray-800 capitalize">{booking.delivery_time}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information (Admin only) */}
          {isAdmin && booking.user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center gap-3 mb-2">
                  {booking.user.profile_image ? (
                    <img src={`${API_URL}${booking.user.profile_image}`} alt={booking.user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {booking.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{booking.user.name}</p>
                    <p className="text-gray-500 text-sm">{booking.user.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-semibold text-gray-800">{booking.user.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-gray-800">{booking.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-semibold text-gray-800">{booking.user.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="font-semibold text-gray-800">{booking.user.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {isAnimal ? 'Message' : 'Special Instructions'}
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}

          {/* Total Price */}
          <div className={`p-5 rounded-xl border-2 ${
            isAnimal 
              ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Total Amount</p>
                {isAnimal && (
                  <p className="text-xs text-gray-500">This is an estimated price</p>
                )}
              </div>
              <p className="text-4xl font-bold text-gray-800">
                Rs. {Number(booking.total_price).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Booked on: {formatDateTime(booking.createdAt)}</p>
            {booking.updatedAt !== booking.createdAt && (
              <p>Last updated: {formatDateTime(booking.updatedAt)}</p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isAdmin && onStatusUpdate && booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <div className="flex flex-wrap gap-2 mb-4">
            <p className="text-sm text-gray-600 w-full mb-2 font-medium">Update Status:</p>
            {availableStatuses
              .filter(status => status !== booking.status)
              .map((status) => {
                const config = getStatusConfig(status);
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${config.bg} ${config.text} border ${config.border} hover:shadow-md`}
                  >
                    Mark as {config.label}
                  </button>
                );
              })}
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
