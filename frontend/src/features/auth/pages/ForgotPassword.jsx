import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useZodForm } from '../../../hooks/useZodForm';
import { forgotPasswordSchema } from '../../../lib/validations';
import { FormProvider, FormInput, FormError, SubmitButton } from '../../../components/forms';
import API from '../../../api/api.js';

// Icons
const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // React Hook Form with Zod validation
  const methods = useZodForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
  });

  const { formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    setError('');

    try {
      await API.post('/auth/forgot-password', { email: data.email });
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
                <EmailIcon />
              </div>
              <h2 className="text-2xl font-bold text-white">Check Your Email!</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                If an account exists with <span className="font-semibold text-green-600">{submittedEmail}</span>, we've sent a password reset link.
              </p>
              <p className="text-gray-500 text-sm mb-6 p-3 bg-amber-50 rounded-xl border border-amber-100">
                The link will expire in 1 hour. Check your spam folder if you don't see it.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
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
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyIcon />
            </div>
            <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
            <p className="text-amber-100 mt-1">No worries, we'll help you reset it</p>
          </div>

          <div className="p-8">
            <FormError message={error} className="mb-6" />

            <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-5">
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<EmailIcon />}
                required
              />

              <SubmitButton 
                loading={isSubmitting}
                loadingText="Sending..."
                variant="primary"
                className="!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600"
              >
                <EmailIcon />
                Send Reset Link
              </SubmitButton>
            </FormProvider>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Sign In
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
