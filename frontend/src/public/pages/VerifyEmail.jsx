import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/api.js';
import { useDocumentTitle } from '../../utils';

export default function VerifyEmail() {
  useDocumentTitle('Verify Email');
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Don't run if no token
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link - no token found');
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const verifyEmail = async () => {
      try {
        const response = await API.get(`/auth/verify-email/${token}`, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setStatus('success');
          setMessage(response.data.message);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error');
          setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
        }
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center animate-fadeIn">
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
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
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
                className="block w-full border-2 border-green-600 text-green-700 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all hover:scale-105 active:scale-95 font-medium"
              >
                Register Again
              </Link>
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl transition-all hover:scale-105 active:scale-95 font-medium"
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