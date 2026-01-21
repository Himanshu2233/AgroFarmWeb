/**
 * Route Constants and Navigation Configuration
 * Centralized route paths and navigation items
 */

// ================================
// ROUTE PATHS - All application routes
// ================================
export const ROUTE_PATHS = {
  // Public Routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  ANIMALS: '/animals',
  ANIMAL_DETAIL: '/animals/:id',
  
  // Auth Routes (Guest Only)
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email/:token',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Protected Routes (Logged in users)
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: '/bookings/:id',
  
  // Admin Routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ANIMALS: '/admin/animals',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Utility Routes
  NOT_FOUND: '*',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

// ================================
// NAVIGATION CONFIG - For navbar & mobile menu
// ================================
export const NAV_CONFIG = {
  // Main navigation links (always visible)
  main: [
    {
      path: ROUTE_PATHS.HOME,
      label: 'Home',
      icon: 'Home',
      emoji: '🏠',
    },
    {
      path: ROUTE_PATHS.PRODUCTS,
      label: 'Products',
      icon: 'ShoppingBag',
      emoji: '🥬',
    },
    {
      path: ROUTE_PATHS.ANIMALS,
      label: 'Animals',
      icon: 'Heart',
      emoji: '🐄',
    },
  ],
  
  // Links for authenticated users
  authenticated: [
    {
      path: ROUTE_PATHS.BOOKINGS,
      label: 'My Bookings',
      icon: 'Calendar',
      emoji: '📅',
    },
    {
      path: ROUTE_PATHS.PROFILE,
      label: 'Profile',
      icon: 'User',
      emoji: '👤',
    },
  ],
  
  // Admin navigation links
  admin: [
    {
      path: ROUTE_PATHS.ADMIN_DASHBOARD,
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      emoji: '📊',
    },
    {
      path: ROUTE_PATHS.ADMIN_PRODUCTS,
      label: 'Products',
      icon: 'Package',
      emoji: '📦',
    },
    {
      path: ROUTE_PATHS.ADMIN_ANIMALS,
      label: 'Animals',
      icon: 'PawPrint',
      emoji: '🐾',
    },
    {
      path: ROUTE_PATHS.ADMIN_BOOKINGS,
      label: 'Bookings',
      icon: 'ClipboardList',
      emoji: '📋',
    },
    {
      path: ROUTE_PATHS.ADMIN_USERS,
      label: 'Users',
      icon: 'Users',
      emoji: '👥',
    },
  ],
  
  // Footer navigation links
  footer: {
    quickLinks: [
      { path: ROUTE_PATHS.PRODUCTS, label: 'Products', emoji: '🥬' },
      { path: ROUTE_PATHS.ANIMALS, label: 'Animals', emoji: '🐄' },
      { path: ROUTE_PATHS.BOOKINGS, label: 'My Bookings', emoji: '📅' },
      { path: ROUTE_PATHS.PROFILE, label: 'My Profile', emoji: '👤' },
    ],
    legal: [
      { path: ROUTE_PATHS.PRIVACY, label: 'Privacy Policy' },
      { path: ROUTE_PATHS.TERMS, label: 'Terms of Service' },
    ],
  },
};

// ================================
// ROUTE METADATA - SEO & Page titles
// ================================
export const ROUTE_METADATA = {
  [ROUTE_PATHS.HOME]: {
    title: 'AgroFarm - Fresh Farm Products Delivered',
    description: 'Get fresh farm products delivered to your doorstep daily.',
  },
  [ROUTE_PATHS.PRODUCTS]: {
    title: 'Products - AgroFarm',
    description: 'Browse our wide range of fresh farm products.',
  },
  [ROUTE_PATHS.ANIMALS]: {
    title: 'Farm Animals - AgroFarm',
    description: 'Explore healthy livestock for your farm needs.',
  },
  [ROUTE_PATHS.LOGIN]: {
    title: 'Login - AgroFarm',
    description: 'Sign in to your AgroFarm account.',
  },
  [ROUTE_PATHS.REGISTER]: {
    title: 'Register - AgroFarm',
    description: 'Create your AgroFarm account today.',
  },
  [ROUTE_PATHS.PROFILE]: {
    title: 'My Profile - AgroFarm',
    description: 'Manage your AgroFarm profile and settings.',
  },
  [ROUTE_PATHS.BOOKINGS]: {
    title: 'My Bookings - AgroFarm',
    description: 'View and manage your product bookings.',
  },
  [ROUTE_PATHS.ADMIN_DASHBOARD]: {
    title: 'Admin Dashboard - AgroFarm',
    description: 'AgroFarm administration panel.',
  },
};
