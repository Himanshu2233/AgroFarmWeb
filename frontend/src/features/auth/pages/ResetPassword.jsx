import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useZodForm } from '../../../hooks/useZodForm';
import { resetPasswordSchema } from '../../../lib/validations';
import { FormProvider, FormInput, FormError, SubmitButton } from '../../../components/forms';
import API from '../../../api/api.js';

// Icons
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // React Hook Form with Zod validation
  const methods = useZodForm({
    schema: resetPasswordSchema,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    setError('');

    try {
      await API.post(`/auth/reset-password/${token}`, {
        password: data.password
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Your password has been reset successfully.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Redirecting to login page...
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyIcon />
            </div>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-green-100 mt-1">Enter your new password below</p>
          </div>

          <div className="p-8">
            <FormError message={error} className="mb-6" />

            <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-5">
              <FormInput
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                leftIcon={<LockIcon />}
                helperText="Min 6 characters with uppercase, lowercase & number"
                required
              />

              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                leftIcon={<ShieldIcon />}
                required
              />

              <SubmitButton 
                loading={isSubmitting}
                loadingText="Resetting..."
              >
                <CheckIcon />
                Reset Password
              </SubmitButton>
            </FormProvider>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
