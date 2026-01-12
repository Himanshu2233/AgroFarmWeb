/**
 * Private Routes Configuration
 * Routes requiring authentication (logged-in users only)
 */
import { lazy } from 'react';
import { ROUTE_PATHS } from './constants';

// ================================
// LAZY LOADED PRIVATE PAGES
// ================================
const Profile = lazy(() => import('../pages/Profile'));
const Bookings = lazy(() => import('../pages/Bookings'));

// ================================
// PRIVATE ROUTES CONFIG (Auth Required)
// ================================
export const privateRoutes = [
  {
    path: ROUTE_PATHS.PROFILE,
    element: Profile,
    title: 'My Profile',
    description: 'View and edit your profile',
    requiresAuth: true,
    allowedRoles: ['customer', 'admin'], // Both can access
  },
  {
    path: ROUTE_PATHS.BOOKINGS,
    element: Bookings,
    title: 'My Bookings',
    description: 'View your booking history',
    requiresAuth: true,
    allowedRoles: ['customer'], // Customers only (admins redirected)
    customerOnly: true,
  },
];

export default privateRoutes;
