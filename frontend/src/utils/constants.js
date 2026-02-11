// App Constants
export const APP_NAME = 'AgroFarm';

export const CONTACT_INFO = {
  phone: '+977 98123 45678',
  email: 'hello@agrofarm.com',
  address: '123 Farm Road, Kathmandu, Nepal - 44600',
  hours: 'Sun-Sat: 6AM - 8PM'
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/agrofarm',
  twitter: 'https://twitter.com/agrofarm',
  instagram: 'https://instagram.com/agrofarm',
  youtube: 'https://youtube.com/agrofarm',
  whatsapp: 'https://wa.me/9779824737503'
};

export const SERVICES = [
  { icon: '🚚', label: 'Daily Delivery' },
  { icon: '📦', label: 'Weekly Subscriptions' },
  { icon: '🌿', label: 'Organic Products' },
  { icon: '💯', label: 'Quality Guarantee' },
  { icon: '↩️', label: 'Easy Returns' },
];

export const ROUTE_PATHS = {
  HOME: '/',
  PRODUCTS: '/products',
  ANIMALS: '/animals',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  ADMIN: '/admin',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  REFUND: '/refund',
  FAQ: '/faq'
};

export const NAV_CONFIG = {
  mainLinks: [
    { path: '/', label: 'Home', emoji: '🏠' },
    { path: '/products', label: 'Products', emoji: '🥛' },
    { path: '/animals', label: 'Animals', emoji: '🐄' },
    { path: '/about', label: 'About Us', emoji: 'ℹ️' }
  ],
  authLinks: [
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' }
  ],
  footer: {
    quickLinks: [
      { path: '/products', label: 'Products', emoji: '🛒' },
      { path: '/animals', label: 'Animals', emoji: '🐄' },
      { path: '/bookings', label: 'My Bookings', emoji: '📋' },
      { path: '/profile', label: 'My Profile', emoji: '👤' },
      { path: '/recipes', label: 'Recipes', emoji: '🍽️' },
      { path: '/harvest-calendar', label: 'Harvest Calendar', emoji: '📅' }

    ],
    services: [
      { label: 'Fresh Milk', emoji: '🥛' },
      { label: 'Farm Animals', emoji: '🐄' },
      { label: 'Organic Products', emoji: '🌿' },
      { label: 'Farm Consulting', emoji: '📋' }
    ]
  }
};
