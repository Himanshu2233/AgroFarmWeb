/**
 * Routes Module - Central Export
 * 
 * ROUTES STRUCTURE:
 * ==================
 * 
 * constants.js     - All route paths, navigation config, and metadata (SINGLE SOURCE OF TRUTH)
 * publicRoutes.jsx - Routes accessible to everyone (Home, Products, Animals)
 * authRoutes.jsx   - Auth pages with guest-only protection (Login, Register, Password Reset)
 * privateRoutes.jsx - Routes requiring authentication (Profile, Bookings)
 * adminRoutes.jsx  - Routes requiring admin role (Dashboard, Manage Products/Animals/Bookings/Users)
 * AppRoutes.jsx    - Main router component that renders all routes
 * 
 * USAGE:
 * ------
 * import { ROUTE_PATHS, NAV_CONFIG } from '@/routes';
 * <Link to={ROUTE_PATHS.PRODUCTS}>Products</Link>
 */

export { publicRoutes } from './publicRoutes';
export { authRoutes } from './authRoutes';
export { privateRoutes } from './privateRoutes';
export { adminRoutes } from './adminRoutes';
export { NAV_CONFIG, ROUTE_PATHS, ROUTE_METADATA } from './constants';
export { AppRoutes } from './AppRoutes';
