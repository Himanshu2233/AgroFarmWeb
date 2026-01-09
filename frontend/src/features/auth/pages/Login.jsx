import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useZodForm } from '../../../hooks/useZodForm';
import { loginSchema } from '../../../lib/validations';
import { FormProvider, FormInput, FormError, SubmitButton } from '../../../components/forms';
import API from '../../../api/api.js';

// Icons
const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LoginIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

export default function Login() {
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // React Hook Form with Zod validation
  const methods = useZodForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    setError('');
    setNeedsVerification(false);

    try {
      const response = await API.post('/auth/login', data);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      const responseData = err.response?.data;
      
      if (responseData?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(responseData.email);
      } else {
        setError(responseData?.message || 'Login failed');
      }
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await API.post('/auth/resend-verification', { email: unverifiedEmail });
      alert('✅ Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
            <p className="text-green-100 mt-1">Sign in to your AgroFarm account</p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            <FormError message={error} className="mb-6" />

            {/* Needs Verification Message */}
            {needsVerification && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <EmailIcon />
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">Email Not Verified</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    Please verify your email address before logging in.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {resending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <EmailIcon />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {!needsVerification && (
              <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-5">
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<EmailIcon />}
                  required
                />

                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<LockIcon />}
                  required
                />

                <div className="text-right">
                  <Link to="/forgot-password" className="text-green-600 text-sm hover:text-green-700 font-medium transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <SubmitButton 
                  loading={isSubmitting}
                  loadingText="Signing in..."
                >
                  <LoginIcon />
                  Sign In
                </SubmitButton>
              </FormProvider>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
