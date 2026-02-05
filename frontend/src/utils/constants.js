// App Constants
export const APP_NAME = 'AgroFarm';

export const CONTACT_INFO = {
  phone: '+91 1234567890',
  email: 'contact@agrofarm.com',
  address: 'Agricultural Hub, Green Valley, India'
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/agrofarm',
  twitter: 'https://twitter.com/agrofarm',
  instagram: 'https://instagram.com/agrofarm',
  youtube: 'https://youtube.com/agrofarm'
};

export const SERVICES = [
  'Fresh Products',
  'Farm Animals',
  'Agricultural Supplies',
  'Farm Consulting'
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
  ADMIN: '/admin'
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
      { path: '/', label: 'Home', emoji: '🏠' },
      { path: '/products', label: 'Products', emoji: '🥛' },
      { path: '/animals', label: 'Animals', emoji: '🐄' }
    ],
    services: [
      { label: 'Fresh Milk', emoji: '🥛' },
      { label: 'Farm Animals', emoji: '🐄' },
      { label: 'Organic Products', emoji: '🌿' },
      { label: 'Farm Consulting', emoji: '📋' }
    ]
  }
};
