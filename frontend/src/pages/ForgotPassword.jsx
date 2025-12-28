import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">
            If an account exists with <strong>{email}</strong>, we've sent a password reset link.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            The link will expire in 1 hour. Check your spam folder if you don't see it.
          </p>
          <Link
            to="/login"
            className="inline-block bg-green-800 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-green-800">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : '📨 Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-green-800 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}