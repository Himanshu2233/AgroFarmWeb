import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';

/**
 * ProtectedRoute - Requires user to be logged in
 * Supports both layout routes (with Outlet) and wrapper routes (with children)
 * Use requireAdmin prop for admin-only routes
 */
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌾</div>
          <p className="text-green-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for admin access if required
  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <a href="/" className="text-green-800 underline hover:text-green-600">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  // Support both layout routes (Outlet) and wrapper routes (children)
  return children ? children : <Outlet />;
};

/**
 * CustomerOnlyRoute - Requires logged in user who is NOT admin
 * Admins are redirected to admin panel
 */
export const CustomerOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🌾</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins cannot access customer-only routes
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

/**
 * AdminRoute - Requires admin role
 * Regular users are shown access denied or redirected
 */
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🌾</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Show access denied message before redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <a href="/" className="text-green-800 underline hover:text-green-600">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * GuestOnlyRoute - Only for non-logged-in users
 * Useful for login/register pages
 */
export const GuestOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🌾</div>
      </div>
    );
  }

  // If already logged in, redirect to home or dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return children;
};