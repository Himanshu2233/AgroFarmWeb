import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { 
  ProtectedRoute, 
  AdminRoute, 
  GuestOnlyRoute,
  CustomerOnlyRoute 
} from './components/ProtectedRoute.jsx';

// ========================================
// LAZY LOADED PAGES - Code splitting for better performance
// ========================================

// PUBLIC PAGES - Anyone can access
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Animals = lazy(() => import('./pages/Animals'));

// GUEST ONLY - Only non-logged-in users
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// PROTECTED PAGES - Logged in users only
const Bookings = lazy(() => import('./pages/Bookings'));
const Profile = lazy(() => import('./pages/Profile'));

// ADMIN PAGES - Admin role required
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAnimals = lazy(() => import('./pages/admin/AdminAnimals'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

// Page Loading Component with nice animation
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-green-600 font-medium animate-pulse">Loading AgroFarm...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
        {/* ================================ */}
        {/* PUBLIC ROUTES - No auth required */}
        {/* ================================ */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/animals" element={<Animals />} />
        
        {/* GUEST ONLY - Redirect if already logged in */}
        <Route path="/login" element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        } />
        <Route path="/register" element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        } />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================================ */}
        {/* PROTECTED ROUTES - Login required */}
        {/* ================================ */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* CUSTOMER ONLY - Admins redirected to admin panel */}
        <Route path="/bookings" element={
          <CustomerOnlyRoute>
            <Bookings />
          </CustomerOnlyRoute>
        } />

        {/* ================================ */}
        {/* ADMIN ROUTES - Admin role required */}
        {/* ================================ */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        } />
        <Route path="/admin/animals" element={
          <AdminRoute>
            <AdminAnimals />
          </AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <AdminBookings />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
