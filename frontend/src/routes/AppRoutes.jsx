/**
 * AppRoutes - Central Route Configuration Component
 * Renders all application routes with proper wrappers
 */
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { privateRoutes } from './privateRoutes';
import { adminRoutes } from './adminRoutes';
import { 
  ProtectedRoute, 
  AdminRoute, 
  GuestOnlyRoute,
  CustomerOnlyRoute 
} from '../components';
import { PageLoader } from '../components/common';
import PageTransition from '../components/common/PageTransition';

// 404 Not Found Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div className="text-center px-6">
      <span className="text-8xl mb-6 block">🌾</span>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Oops! The page you're looking for seems to have wandered off the farm.
      </p>
      <a 
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
      >
        <span>🏠</span>
        Back to Home
      </a>
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader message="Loading page..." />}>
      <PageTransition>
        <Routes>
          {/* ================================ */}
          {/* PUBLIC ROUTES - No auth required */}
          {/* ================================ */}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}

          {/* ================================ */}
          {/* AUTH ROUTES - Guest only or anyone */}
          {/* ================================ */}
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.guestOnly ? (
                  <GuestOnlyRoute>
                    <route.element />
                  </GuestOnlyRoute>
                ) : (
                  <route.element />
                )
              }
            />
          ))}

          {/* ================================ */}
          {/* PRIVATE ROUTES - Auth required */}
          {/* ================================ */}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.customerOnly ? (
                  <CustomerOnlyRoute>
                    <route.element />
                  </CustomerOnlyRoute>
                ) : (
                  <ProtectedRoute>
                    <route.element />
                  </ProtectedRoute>
                )
              }
            />
          ))}

          {/* ================================ */}
          {/* ADMIN ROUTES - Admin role required */}
          {/* ================================ */}
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AdminRoute>
                  <route.element />
                </AdminRoute>
              }
            />
          ))}

          {/* ================================ */}
          {/* 404 - Catch all route */}
          {/* ================================ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
}

export default AppRoutes;
