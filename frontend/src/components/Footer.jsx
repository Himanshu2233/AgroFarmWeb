import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-4xl">🌾</span>
              <span className="text-2xl font-bold">AgroFarm</span>
            </Link>
            <p className="text-green-200 text-sm leading-relaxed">
              Fresh farm products delivered to your doorstep. We connect local farmers with consumers for the freshest produce.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-2xl hover:scale-110 transition">📘</a>
              <a href="#" className="text-2xl hover:scale-110 transition">📸</a>
              <a href="#" className="text-2xl hover:scale-110 transition">🐦</a>
              <a href="#" className="text-2xl hover:scale-110 transition">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-green-200 hover:text-white transition">
                  🥬 Products
                </Link>
              </li>
              <li>
                <Link to="/animals" className="text-green-200 hover:text-white transition">
                  🐄 Animals
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-green-200 hover:text-white transition">
                  📅 My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-green-200 hover:text-white transition">
                  👤 My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Our Services</h3>
            <ul className="space-y-2 text-green-200">
              <li className="flex items-center gap-2">
                <span>🚚</span> Daily Delivery
              </li>
              <li className="flex items-center gap-2">
                <span>📦</span> Weekly Subscriptions
              </li>
              <li className="flex items-center gap-2">
                <span>🌿</span> Organic Products
              </li>
              <li className="flex items-center gap-2">
                <span>💯</span> Quality Guarantee
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Contact Us</h3>
            <ul className="space-y-3 text-green-200">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123 Farm Road, Green Valley, India - 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:hello@agrofarm.com" className="hover:text-white transition">
                  hello@agrofarm.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>Mon-Sat: 6AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-300 text-sm">
              © {currentYear} AgroFarm. All rights reserved. Made with 💚 in India
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-green-300 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-green-300 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-green-300 hover:text-white transition">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
