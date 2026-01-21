/**
 * Authentication Routes Configuration
 * Routes for guest users (login, register, password reset)
 * These routes redirect authenticated users away
 */
import { lazy } from 'react';
import { ROUTE_PATHS } from './constants';

// ================================
// LAZY LOADED AUTH PAGES (Using Feature-based structure with RHF + Zod)
// ================================
const Login = lazy(() => import('../features/auth/pages/Login'));
const Register = lazy(() => import('../features/auth/pages/Register'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('../features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../features/auth/pages/ResetPassword'));

// ================================
// AUTH ROUTES CONFIG (Guest Only)
// ================================
export const authRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: Login,
    title: 'Login',
    description: 'Sign in to your account',
    guestOnly: true, // Redirects logged-in users
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: Register,
    title: 'Register',
    description: 'Create a new account',
    guestOnly: true,
  },
  {
    path: ROUTE_PATHS.VERIFY_EMAIL,
    element: VerifyEmail,
    title: 'Verify Email',
    description: 'Verify your email address',
    guestOnly: false, // Anyone can access
  },
  {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    element: ForgotPassword,
    title: 'Forgot Password',
    description: 'Reset your password',
    guestOnly: false,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: ResetPassword,
    title: 'Reset Password',
    description: 'Set a new password',
    guestOnly: false,
  },
];

export default authRoutes;
