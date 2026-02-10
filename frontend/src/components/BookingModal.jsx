import { useState } from 'react';
import { createBooking } from '../api/bookingService';
import { useToast } from '../contexts';
import Modal from './Modal';

const SCHEDULE_OPTIONS = [
  { value: 'once', label: 'Once', description: 'One-time purchase' },
  { value: 'daily', label: 'Daily', description: 'Fresh delivery every day' },
  { value: 'weekly', label: 'Weekly', description: 'Once a week delivery' },
  { value: 'monthly', label: 'Monthly', description: 'Once a month delivery' },
];

const DELIVERY_TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning', time: '6 AM - 10 AM' },
  { value: 'afternoon', label: '☀️ Afternoon', time: '12 PM - 4 PM' },
  { value: 'evening', label: '🌆 Evening', time: '5 PM - 8 PM' },
];

export default function BookingModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    schedule: 'once',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    deliveryTime: 'morning',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return null;
    
    let deliveries = 0;
    switch (formData.schedule) {
      case 'once':
        deliveries = 1;
        break;
      case 'daily':
        deliveries = days;
        break;
      case 'weekly':
        deliveries = Math.ceil(days / 7);
        break;
      case 'monthly':
        deliveries = Math.ceil(days / 30);
        break;
    }
    return { days, deliveries };
  };

  const isOnce = formData.schedule === 'once';
  const duration = isOnce ? null : calculateDuration();
  const totalPrice = duration ? product.price * formData.quantity * duration.deliveries : product.price * formData.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isOnce) {
      if (!formData.endDate) {
        setError('Please select an end date');
        setLoading(false);
        return;
      }

      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }
    }

    try {
      await createBooking({
        product_id: product.id,
        quantity: parseInt(formData.quantity),
        schedule_type: formData.schedule,
        start_date: formData.startDate,
        end_date: isOnce ? formData.startDate : formData.endDate,
        delivery_time: formData.deliveryTime,
        notes: formData.notes,
      });
      
      toast.success('Booking created successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="default">
      <Modal.Header>
        <Modal.Title>Book Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div className="text-4xl">{product.emoji || '🌱'}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-green-600 font-medium">Rs. {product.price} / {product.unit}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={product.stock || 100}
                className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(product.stock || 100, prev.quantity + 1) }))}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                {product.stock ? `(${product.stock} available)` : ''}
              </span>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Schedule
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SCHEDULE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, schedule: option.value }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.schedule === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className={`grid ${isOnce ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isOnce ? 'Delivery Date' : 'Start Date'}
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {!isOnce && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Preferred Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Delivery Time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DELIVERY_TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryTime: option.value }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.deliveryTime === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Summary */}
          {duration && duration.days > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Booking Summary</span>
              </div>
              <div className="text-sm text-blue-600 space-y-1">
                <p>📅 Duration: <span className="font-medium">{duration.days} days</span></p>
                <p>🚚 Total Deliveries: <span className="font-medium">{duration.deliveries} deliveries</span></p>
                <p>📦 Quantity per delivery: <span className="font-medium">{formData.quantity} {product.unit}</span></p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any special delivery instructions..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                {duration && duration.deliveries > 1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Rs. {product.price.toLocaleString()} × {formData.quantity} × {duration.deliveries} deliveries
                  </p>
                )}
              </div>
              <span className="text-3xl font-bold text-green-600">Rs. {totalPrice.toLocaleString()}</span>
            </div>
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
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
