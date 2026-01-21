import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  const verifyEmail = useCallback(async () => {
    // Don't run if no token
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link - no token found');
      return;
    }

    try {
      const response = await API.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Verifying State */}
        {status === 'verifying' && (
          <>
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Verifying Your Email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-green-800 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition"
            >
              🔐 Login Now
            </Link>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/register"
                className="block w-full border-2 border-green-800 text-green-800 py-3 rounded-full hover:bg-green-800 hover:text-white transition"
              >
                Register Again
              </Link>
              <Link
                to="/login"
                className="block w-full bg-green-800 text-white py-3 rounded-full hover:bg-green-700 transition"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}