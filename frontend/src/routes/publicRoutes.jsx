/**
 * Public Routes Configuration
 * Routes accessible to all users (authenticated or not)
 */
import { lazy } from 'react';
import { ROUTE_PATHS } from './constants';

// ================================
// LAZY LOADED PUBLIC PAGES
// ================================
const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Animals = lazy(() => import('../pages/Animals'));
const AboutUs = lazy(() => import('../pages/AboutUs'));

// ================================
// PUBLIC ROUTES CONFIG
// ================================
export const publicRoutes = [
  {
    path: ROUTE_PATHS.HOME,
    element: Home,
    title: 'Home',
    description: 'Welcome to AgroFarm',
  },
  {
    path: ROUTE_PATHS.ABOUT,
    element: AboutUs,
    title: 'About Us',
    description: 'Learn more about AgroFarm',
  },
  {
    path: ROUTE_PATHS.PRODUCTS,
    element: Products,
    title: 'Products',
    description: 'Browse our farm products',
  },
  {
    path: ROUTE_PATHS.PRODUCT_DETAIL,
    element: ProductDetail,
    title: 'Product Details',
    description: 'View product information',
  },
  {
    path: ROUTE_PATHS.ANIMALS,
    element: Animals,
    title: 'Animals',
    description: 'Explore farm animals',
  },
];

export default publicRoutes;
