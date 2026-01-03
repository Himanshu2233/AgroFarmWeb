/**
 * Route Configuration for AgroFarm
 * 
 * This file defines all routes in the application organized by access level:
 * - PUBLIC: Anyone can access (even logged out users)
 * - PRIVATE: Only logged-in users can access
 * - ADMIN: Only admin users can access
 */

// PUBLIC ROUTES - No authentication required
export const PUBLIC_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/products', name: 'Products' },
  { path: '/products/:id', name: 'Product Detail' },
  { path: '/animals', name: 'Animals' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/verify-email/:token', name: 'Verify Email' },
  { path: '/forgot-password', name: 'Forgot Password' },
  { path: '/reset-password/:token', name: 'Reset Password' },
];

// PRIVATE ROUTES - Authentication required (any logged-in user)
export const PRIVATE_ROUTES = [
  { path: '/profile', name: 'Profile' },
  { path: '/bookings', name: 'My Bookings' }, // Customers only (admin redirects)
];

// ADMIN ROUTES - Admin role required
export const ADMIN_ROUTES = [
  { path: '/admin', name: 'Dashboard' },
  { path: '/admin/products', name: 'Manage Products' },
  { path: '/admin/animals', name: 'Manage Animals' },
  { path: '/admin/bookings', name: 'Manage Bookings' },
  { path: '/admin/users', name: 'Manage Users' },
];

// Navigation links for navbar
export const NAV_LINKS = {
  public: [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🥬' },
    { path: '/animals', label: 'Animals', icon: '🐄' },
  ],
  private: [
    { path: '/bookings', label: 'My Bookings', icon: '📅' },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '🥬' },
    { path: '/admin/animals', label: 'Animals', icon: '🐄' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
  ],
};
