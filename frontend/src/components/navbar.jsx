import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-800 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🌾</span>
          <h1 className="text-white text-2xl font-bold">AgroFarm</h1>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          <li>
            <Link to="/" className="text-white no-underline font-medium hover:text-green-300 transition">
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="text-white no-underline font-medium hover:text-green-300 transition">
              🥬 Products
            </Link>
          </li>
          <li>
            <Link to="/animals" className="text-white no-underline font-medium hover:text-green-300 transition">
              🐄 Animals
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/bookings" className="text-white no-underline font-medium hover:text-green-300 transition">
                📅 My Bookings
              </Link>
            </li>
          )}
          {user && user.role === 'admin' && (
            <li>
              <Link to="/admin" className="text-yellow-300 no-underline font-medium hover:text-yellow-100 transition">
                🛠️ Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-white">
                {user.role === 'admin' ? '👑' : '👋'} {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full border-2 border-white bg-transparent text-white font-medium hover:bg-white hover:text-green-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border-2 border-white bg-transparent text-white font-medium hover:bg-white hover:text-green-800 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-orange-400 text-white font-medium hover:bg-orange-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link to="/" className="text-white no-underline">🏠 Home</Link>
          <Link to="/products" className="text-white no-underline">🥬 Products</Link>
          <Link to="/animals" className="text-white no-underline">🐄 Animals</Link>
          {user && (
            <Link to="/bookings" className="text-white no-underline">📅 My Bookings</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-yellow-300 no-underline">🛠️ Admin Dashboard</Link>
          )}
          <div className="flex gap-3 mt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border-2 border-white text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-full border-2 border-white text-white">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-full bg-orange-400 text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}