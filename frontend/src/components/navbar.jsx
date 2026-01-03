import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Track scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Check if current path matches
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/products', label: 'Products', icon: '🥬' },
    { to: '/animals', label: 'Animals', icon: '🐄' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-green-800 to-emerald-800 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🌾</span>
            <h1 className={`text-xl sm:text-2xl font-bold font-display transition-colors ${
              isScrolled ? 'text-green-800' : 'text-white'
            }`}>
              AgroFarm
            </h1>
          </Link>

          {/* Navigation Links - Desktop */}
          <ul className="hidden md:flex gap-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? isScrolled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.to) && (
                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isScrolled ? 'bg-green-600' : 'bg-white'
                    }`} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isScrolled 
                      ? 'bg-green-100 hover:bg-green-200 text-green-800' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isScrolled 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-green-800'
                  }`}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium max-w-24 truncate">{user.name}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeIn overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                      </span>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">👤</span>
                        <span>My Profile</span>
                      </Link>
                      
                      {user.role !== 'admin' && (
                        <Link
                          to="/bookings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">📅</span>
                          <span>My Bookings</span>
                        </Link>
                      )}
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          <span className="text-lg">🛠️</span>
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>
                    
                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isScrolled
                      ? 'text-green-700 hover:bg-green-50'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-medium hover:from-orange-500 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-4 pb-6 pt-2 space-y-1 ${
          isScrolled ? 'bg-white' : 'bg-green-800'
        }`}>
          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive(link.to)
                  ? isScrolled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-white/20 text-white'
                  : isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          
          {/* User Links */}
          {user && (
            <>
              <div className={`border-t my-3 ${isScrolled ? 'border-gray-200' : 'border-white/20'}`} />
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">👤</span>
                <span>My Profile</span>
              </Link>
              {user.role !== 'admin' && (
                <Link 
                  to="/bookings" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <span>My Bookings</span>
                </Link>
              )}
            </>
          )}
          
          {/* Admin Links */}
          {user && user.role === 'admin' && (
            <>
              <div className={`border-t my-3 ${isScrolled ? 'border-gray-200' : 'border-white/20'}`} />
              <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                isScrolled ? 'text-gray-500' : 'text-white/60'
              }`}>
                Admin
              </p>
              {[
                { to: '/admin', label: 'Dashboard', icon: '📊' },
                { to: '/admin/products', label: 'Products', icon: '🥬' },
                { to: '/admin/animals', label: 'Animals', icon: '🐄' },
                { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
                { to: '/admin/users', label: 'Users', icon: '👥' },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isScrolled ? 'text-purple-700 hover:bg-purple-50' : 'text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </>
          )}
          
          {/* Auth Buttons */}
          <div className={`border-t my-3 ${isScrolled ? 'border-gray-200' : 'border-white/20'}`} />
          <div className="flex gap-3 px-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`flex-1 text-center px-4 py-3 rounded-xl font-medium border-2 transition-colors ${
                    isScrolled 
                      ? 'border-green-600 text-green-700 hover:bg-green-50' 
                      : 'border-white text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-medium hover:from-orange-500 hover:to-amber-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}