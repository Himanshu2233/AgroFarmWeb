import { useState } from 'react';
import { createBooking } from '../api/bookingService.js';

export default function BookingModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    schedule_type: 'daily',
    start_date: '',
    end_date: '',
    delivery_time: 'morning',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBooking({
        product_id: product.id,
        ...formData,
        quantity: parseInt(formData.quantity)
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = product.price * formData.quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-800 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">📅 Book Product</h2>
          <button onClick={onClose} className="text-2xl hover:text-green-300">×</button>
        </div>

        {/* Product Info */}
        <div className="p-4 border-b flex items-center gap-4">
          <span className="text-4xl">{product.emoji || '🌱'}</span>
          <div>
            <h3 className="font-bold text-green-800">{product.name}</h3>
            <p className="text-gray-600">₹{product.price} {product.unit}</p>
            <p className="text-sm text-green-600">Stock: {product.stock}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={product.stock}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Schedule Type</label>
            <select
              name="schedule_type"
              value={formData.schedule_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="once">One Time</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* End Date (optional) */}
          {formData.schedule_type !== 'once' && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">End Date (Optional)</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Delivery Time */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Preferred Delivery Time</label>
            <select
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="morning">Morning (6 AM - 9 AM)</option>
              <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="2"
            />
          </div>

          {/* Total Price */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-2xl font-bold text-green-800">₹{totalPrice}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}