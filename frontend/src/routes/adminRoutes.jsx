/**
 * Admin Routes Configuration
 * Routes requiring admin role
 */
import { lazy } from 'react';
import { ROUTE_PATHS } from './constants';

// ================================
// LAZY LOADED ADMIN PAGES
// ================================
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminAnimals = lazy(() => import('../pages/admin/AdminAnimals'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));

// ================================
// ADMIN ROUTES CONFIG
// ================================
export const adminRoutes = [
  {
    path: ROUTE_PATHS.ADMIN_DASHBOARD,
    element: AdminDashboard,
    title: 'Admin Dashboard',
    description: 'Overview and analytics',
    icon: '📊',
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN_PRODUCTS,
    element: AdminProducts,
    title: 'Manage Products',
    description: 'Add, edit, and remove products',
    icon: '📦',
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN_ANIMALS,
    element: AdminAnimals,
    title: 'Manage Animals',
    description: 'Add, edit, and remove animals',
    icon: '🐾',
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN_BOOKINGS,
    element: AdminBookings,
    title: 'Manage Bookings',
    description: 'View and manage all bookings',
    icon: '📋',
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN_USERS,
    element: AdminUsers,
    title: 'Manage Users',
    description: 'View and manage user accounts',
    icon: '👥',
    showInNav: true,
  },
];

export default adminRoutes;
