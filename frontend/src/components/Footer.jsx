import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS, SERVICES, ROUTE_PATHS, NAV_CONFIG } from '../utils/constants';

// SVG Social Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/**
 * Enhanced Footer Component
 * Modern footer with newsletter signup, animations, and comprehensive links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                { icon: <FacebookIcon />, label: 'Facebook', href: SOCIAL_LINKS.facebook, bg: 'hover:bg-blue-600' },
                { icon: <InstagramIcon />, label: 'Instagram', href: SOCIAL_LINKS.instagram, bg: 'hover:bg-pink-600' },
                { icon: <TwitterXIcon />, label: 'Twitter', href: SOCIAL_LINKS.twitter, bg: 'hover:bg-gray-700' },
                { icon: <YouTubeIcon />, label: 'YouTube', href: SOCIAL_LINKS.youtube, bg: 'hover:bg-red-600' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-white/10 ${social.bg} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
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
                    onClick={scrollToTop}
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
                  onClick={scrollToTop}
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
                  <WhatsAppIcon />
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
                onClick={scrollToTop}
                className="text-green-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to={ROUTE_PATHS.TERMS}
                onClick={scrollToTop}
                className="text-green-300 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/refund"
                onClick={scrollToTop}
                className="text-green-300 hover:text-white transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                to="/faq"
                onClick={scrollToTop}
                className="text-green-300 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Bottom Decoration */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 animate-shimmer" />
    </footer>
  );
}
