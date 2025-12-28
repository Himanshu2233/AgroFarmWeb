import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/api.js';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);

    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      
      // Check if user needs email verification
      if (data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(data.email);
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await API.post('/auth/resend-verification', { email: unverifiedEmail });
      alert('✅ Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🌾 AgroFarm</h1>
          <p className="text-gray-600 mt-2">Welcome back!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Needs Verification Message */}
        {needsVerification && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-bold text-yellow-800 mb-2">Email Not Verified</h3>
              <p className="text-yellow-700 text-sm mb-4">
                Please verify your email address before logging in.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-full font-medium transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : '📨 Resend Verification Email'}
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {!needsVerification && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
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
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-green-800 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-full font-medium transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : '🔐 Login'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-800 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}