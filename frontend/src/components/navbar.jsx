import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-green-800 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌾</span>
          <h1 className="text-white text-2xl font-bold">AgroFarm</h1>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          <li>
            <a href="/" className="text-white no-underline font-medium hover:text-green-300 transition">
              🏠 Home
            </a>
          </li>
          <li>
            <a href="/products" className="text-white no-underline font-medium hover:text-green-300 transition">
              🥬 Products
            </a>
          </li>
          <li>
            <a href="/animals" className="text-white no-underline font-medium hover:text-green-300 transition">
              🐄 Animals
            </a>
          </li>
          <li>
            <a href="/bookings" className="text-white no-underline font-medium hover:text-green-300 transition">
              📅 My Bookings
            </a>
          </li>
          <li>
            <a href="/about" className="text-white no-underline font-medium hover:text-green-300 transition">
              ℹ️ About
            </a>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-3">
          <button className="px-5 py-2 rounded-full border-2 border-white bg-transparent text-white font-medium cursor-pointer hover:bg-white hover:text-green-800 transition">
            Login
          </button>
          <button className="px-5 py-2 rounded-full border-none bg-orange-400 text-white font-medium cursor-pointer hover:bg-orange-500 transition">
            Register
          </button>
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
          <a href="/" className="text-white no-underline">🏠 Home</a>
          <a href="/products" className="text-white no-underline">🥬 Products</a>
          <a href="/animals" className="text-white no-underline">🐄 Animals</a>
          <a href="/bookings" className="text-white no-underline">📅 My Bookings</a>
          <a href="/about" className="text-white no-underline">ℹ️ About</a>
          <div className="flex gap-3 mt-2">
            <button className="px-4 py-2 rounded-full border-2 border-white bg-transparent text-white">Login</button>
            <button className="px-4 py-2 rounded-full bg-orange-400 text-white">Register</button>
          </div>
        </div>
      )}
    </nav>
  );
}