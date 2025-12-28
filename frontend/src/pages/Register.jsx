import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      setRegisteredEmail(formData.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await API.post('/auth/resend-verification', { email: registeredEmail });
      alert('Verification email sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  // Success state - show verification message
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-2">
            We've sent a verification link to:
          </p>
          <p className="font-medium text-green-800 mb-6">{registeredEmail}</p>
          <p className="text-gray-500 text-sm mb-6">
            Click the link in the email to verify your account. 
            The link will expire in 24 hours.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full border-2 border-green-800 text-green-800 py-3 rounded-full hover:bg-green-800 hover:text-white transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : '📨 Resend Verification Email'}
            </button>

            <Link
              to="/login"
              className="block w-full bg-green-800 text-white py-3 rounded-full hover:bg-green-700 transition text-center"
            >
              Go to Login
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🌾 Join AgroFarm</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-800 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}