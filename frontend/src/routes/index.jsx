import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, LoadingSpinner } from '../components';

// Public Pages (lazy loaded)
const Home = lazy(() => import('../public/pages/Home'));
const Products = lazy(() => import('../public/pages/Products'));
const ProductDetail = lazy(() => import('../public/pages/ProductDetail'));
const Animals = lazy(() => import('../public/pages/Animals'));
const AboutUs = lazy(() => import('../public/pages/AboutUs'));
const Login = lazy(() => import('../public/pages/Login'));
const Register = lazy(() => import('../public/pages/Register'));
const ForgotPassword = lazy(() => import('../public/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../public/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('../public/pages/VerifyEmail'));
const Recipes = lazy(() => import('../pages/Recipes'));
const RecipeDetail = lazy(() => import('../pages/RecipeDetail'));
const HarvestCalendar = lazy(() => import('../pages/HarvestCalendar'));

// Private Pages (lazy loaded)
const Profile = lazy(() => import('../private/pages/Profile'));
const Bookings = lazy(() => import('../private/pages/Bookings'));

// Admin Pages (lazy loaded)
const AdminDashboard = lazy(() => import('../admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('../admin/pages/AdminProducts'));
const AdminAnimals = lazy(() => import('../admin/pages/AdminAnimals'));
const AdminBookings = lazy(() => import('../admin/pages/AdminBookings'));
const AdminUsers = lazy(() => import('../admin/pages/AdminUsers'));
const AdminRecipes = lazy(() => import('../admin/pages/AdminRecipes'));

const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/harvest-calendar" element={<HarvestCalendar />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/animals" element={<AdminAnimals />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/recipes" element={<AdminRecipes />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
