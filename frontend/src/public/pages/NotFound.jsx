import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../utils';
import { APP_NAME } from '../../utils/constants';

export default function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="mb-8">
          <span className="text-8xl md:text-9xl block mb-4 animate-float">🌾</span>
          <h1 className="text-7xl md:text-8xl font-bold text-green-600/20 font-display">404</h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page has gone to greener pastures. The page you're looking for 
          doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 transition-all hover:scale-105 active:scale-95"
          >
            🏠 Go Home
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-white text-green-700 font-medium rounded-xl border border-green-200 hover:bg-green-50 transition-all hover:scale-105 active:scale-95"
          >
            🛒 Browse Products
          </Link>
        </div>

        {/* Help */}
        <p className="mt-10 text-sm text-gray-400">
          If you think this is an error, please{' '}
          <Link to="/about" className="text-green-600 hover:underline">
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
