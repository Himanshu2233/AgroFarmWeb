import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS, SERVICES } from '../../constants/app';
import { ROUTE_PATHS, NAV_CONFIG } from '../../routes/constants';

/**
 * Enhanced Footer Component
 * Modern footer with newsletter signup, animations, and comprehensive links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail('');
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        
        {/* Floating icons */}
        <span className="absolute top-20 left-[10%] text-4xl opacity-10 animate-float">🌾</span>
        <span className="absolute top-40 right-[15%] text-3xl opacity-10 animate-float animation-delay-200">🌻</span>
        <span className="absolute bottom-40 left-[20%] text-4xl opacity-10 animate-float animation-delay-300">🍃</span>
        <span className="absolute bottom-20 right-[25%] text-3xl opacity-10 animate-float animation-delay-500">🌿</span>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-green-700/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-green-700/50 to-emerald-700/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-600/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-3xl">📬</span>
                  Stay Fresh, Stay Updated!
                </h3>
                <p className="text-green-200 max-w-md">
                  Subscribe to get updates on new products, seasonal offers, and farm-fresh deals delivered to your inbox.
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full sm:w-72 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      disabled={isSubmitting || isSubscribed}
                    />
                    {isSubscribed && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-300">
                        ✓
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || isSubscribed || !email}
                    className={`px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubscribed
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Subscribing...
                      </>
                    ) : isSubscribed ? (
                      <>
                        <span>✓</span>
                        Subscribed!
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Subscribe
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <span className="text-5xl transform group-hover:rotate-12 transition-transform duration-300">🌾</span>
              <div>
                <h2 className="text-2xl font-bold font-display">{APP_NAME}</h2>
                <p className="text-green-300 text-sm">Farm to Table</p>
              </div>
            </Link>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Fresh farm products delivered to your doorstep. We connect local farmers with consumers for the freshest, most organic produce.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: '📘', label: 'Facebook', href: SOCIAL_LINKS.facebook },
                { icon: '📸', label: 'Instagram', href: SOCIAL_LINKS.instagram },
                { icon: '🐦', label: 'Twitter', href: SOCIAL_LINKS.twitter },
                { icon: '📺', label: 'YouTube', href: SOCIAL_LINKS.youtube },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {NAV_CONFIG.footer.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-green-200 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.emoji}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={ROUTE_PATHS.ABOUT}
                  className="text-green-200 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">ℹ️</span>
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.slice(0, 6).map((service, index) => (
                <li
                  key={index}
                  className="text-green-200 flex items-center gap-2"
                >
                  <span className="text-lg">{service.icon}</span>
                  <span>{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-green-200 group">
                <span className="text-xl mt-0.5">📍</span>
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-green-200 hover:text-white transition-colors group"
                >
                  <span className="text-xl group-hover:animate-bounce">📞</span>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-green-200 hover:text-white transition-colors group"
                >
                  <span className="text-xl">✉️</span>
                  <span className="group-hover:underline">{CONTACT_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-green-200">
                <span className="text-xl">⏰</span>
                <span>{CONTACT_INFO.hours}</span>
              </li>
              <li className="pt-2">
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-full text-sm font-medium transition-all hover:scale-105"
                >
                  <span>💬</span>
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-green-700/50">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { icon: '🔒', label: 'Secure Payments' },
              { icon: '🚚', label: 'Free Delivery' },
              { icon: '↩️', label: 'Easy Returns' },
              { icon: '✅', label: 'Quality Assured' },
              { icon: '🌿', label: '100% Organic' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm text-green-200"
              >
                <span className="text-lg">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-green-700/50 bg-green-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-300 text-sm text-center md:text-left">
              © {currentYear} {APP_NAME}. All rights reserved. Made with 💚 in Nepal
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to={ROUTE_PATHS.PRIVACY}
                className="text-green-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to={ROUTE_PATHS.TERMS}
                className="text-green-300 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                Refund Policy
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Bottom Decoration */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 animate-shimmer" />
    </footer>
  );
}
