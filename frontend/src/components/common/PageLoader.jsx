import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * PageLoader - Full-page loading component
 * Used as Suspense fallback for lazy-loaded pages
 */
export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-6">
          <span className="text-6xl animate-bounce inline-block">🌾</span>
          <span className="absolute -top-1 -right-1 text-2xl animate-ping">✨</span>
        </div>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="large" />
        
        {/* Loading Text */}
        <p className="mt-4 text-green-700 font-medium animate-pulse">
          {message}
        </p>
        
        {/* Loading Progress Dots */}
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
