import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useZodForm } from '../../../hooks/useZodForm';
import { registerSchema } from '../../../lib/validations';
import { FormProvider, FormInput, FormTextarea, FormError, SubmitButton } from '../../../components/forms';
import API from '../../../api/api.js';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Register() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);

  const methods = useZodForm({
    schema: registerSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
    },
  });

  const { formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    setError('');

    try {
      await API.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address || null,
      });

      setRegisteredEmail(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await API.post('/auth/resend-verification', { email: registeredEmail });
      alert('Verification email sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <EmailIcon />
              </div>
              <h2 className="text-2xl font-bold text-white">Check Your Email!</h2>
            </div>

            <div className="p-8 text-center">
              <p className="text-gray-600 mb-2">We've sent a verification link to:</p>
              <p className="font-semibold text-green-600 text-lg mb-4 px-4 py-2 bg-green-50 rounded-xl inline-block">
                {registeredEmail}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Click the link in the email to verify your account. The link will expire in 24 hours.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full border-2 border-green-600 text-green-600 py-3.5 rounded-xl hover:bg-green-50 transition-all disabled:opacity-50 font-medium"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl text-center font-medium shadow-lg"
                >
                  Go to Login
                </Link>
              </div>
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
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Join AgroFarm</h1>
            <p className="text-green-100 mt-1">Fresh farm products in Kathmandu Valley</p>
          </div>

          <div className="p-8">
            <FormError message={error} className="mb-6" />

            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="space-y-4">
                <FormInput
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  leftIcon={<UserIcon />}
                  required
                />

                <FormInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  leftIcon={<EmailIcon />}
                  required
                />

                <FormInput
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  leftIcon={<PhoneIcon />}
                  helperText="Nepal mobile number (98 or 97)"
                  required
                />

                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  leftIcon={<LockIcon />}
                  helperText="Min 6 characters with uppercase, lowercase & number"
                  required
                />

                <FormInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  leftIcon={<LockIcon />}
                  required
                />

                <FormTextarea
                  name="address"
                  label="Delivery Address (Optional)"
                  placeholder="Enter your address in Kathmandu Valley (area, street, landmark)"
                  rows={2}
                  helperText="We deliver within Kathmandu Valley only"
                />

                <SubmitButton 
                  loading={isSubmitting}
                  loadingText="Creating Account..."
                  className="mt-6"
                >
                  Create Account
                </SubmitButton>
              </div>
            </FormProvider>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

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
