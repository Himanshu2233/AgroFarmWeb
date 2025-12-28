import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-700 text-white hover:bg-green-600 transition"
              >
                <span className="w-8 h-8 bg-white text-green-800 rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span>{user.name}</span>
                <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                  >
                    📅 My Bookings
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-purple-700 hover:bg-gray-100 no-underline"
                    >
                      🛠️ Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
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
            <>
              <Link to="/profile" className="text-white no-underline">👤 My Profile</Link>
              <Link to="/bookings" className="text-white no-underline">📅 My Bookings</Link>
            </>
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
                🚪 Logout
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