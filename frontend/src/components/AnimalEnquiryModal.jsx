import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../contexts';
import { createBooking } from '../api/bookingService';
import Modal from './Modal';

const PREFERRED_TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning', time: '6 AM - 10 AM' },
  { value: 'afternoon', label: '☀️ Afternoon', time: '12 PM - 4 PM' },
  { value: 'evening', label: '🌆 Evening', time: '5 PM - 8 PM' },
];

export default function AnimalEnquiryModal({ animal, onClose, onSuccess }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quantity: 1,
    startDate: new Date().toISOString().split('T')[0],
    preferredTime: 'morning',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasAddress = user?.address?.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createBooking({
        animal_id: animal.id,
        quantity: parseInt(formData.quantity),
        schedule_type: 'once',
        start_date: formData.startDate,
        delivery_time: formData.preferredTime,
        notes: formData.message,
      });
      
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="default">
      <Modal.Header>
        <Modal.Title>Enquire About Animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!hasAddress && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800">Address required</p>
                <p className="text-sm text-amber-600 mt-1">Please add your address before submitting an enquiry.</p>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate('/profile'); }}
                  className="mt-2 text-sm font-medium text-amber-700 underline hover:text-amber-900 transition-colors"
                >
                  Go to Profile → Add Address
                </button>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Animal Info */}
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
            <div className="text-4xl">{animal.emoji || '🐄'}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{animal.name}</h3>
              <p className="text-orange-600 font-medium">Rs. {animal.price?.toLocaleString()}</p>
              <div className="flex gap-3 mt-1 text-sm text-gray-600">
                {animal.age && <span>Age: {animal.age}</span>}
                {animal.weight && <span>Weight: {animal.weight}</span>}
                {animal.quantity && <span className="text-green-600 font-medium">{animal.quantity} available</span>}
              </div>
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
                max={animal.quantity || 100}
                className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(animal.quantity || 100, prev.quantity + 1) }))}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                {animal.quantity ? `(${animal.quantity} available)` : ''}
              </span>
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Visit/Purchase Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PREFERRED_TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, preferredTime: option.value }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.preferredTime === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Your Contact Info</span>
            </div>
            <div className="text-sm text-blue-600 space-y-1">
              <p>📧 {user?.email}</p>
              <p>📱 {user?.phone || 'Not provided'}</p>
              <p className="text-xs text-blue-500 mt-2">We'll use this to contact you about your enquiry</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Any specific questions or requirements..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-orange-600">Rs. {(animal.price * formData.quantity).toLocaleString()}</span>
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
              disabled={loading || !hasAddress}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Enquiry'
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}