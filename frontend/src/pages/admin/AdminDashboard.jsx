import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../api/productService.js';
import { getAllAnimals } from '../../api/animalService.js';
import { getAllBookings } from '../../api/bookingService.js';
import { getAllUsers } from '../../api/userService.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    animals: 0,
    bookings: 0,
    users: 0,
    pendingBookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, animals, bookings, users] = await Promise.all([
        getAllProducts(),
        getAllAnimals(),
        getAllBookings(),
        getAllUsers()
      ]);

      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const revenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

      setStats({
        products: products.length,
        animals: animals.length,
        bookings: bookings.length,
        users: users.length,
        pendingBookings,
        revenue
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Products', 
      value: stats.products, 
      icon: '🥬', 
      link: '/admin/products', 
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    { 
      title: 'Animals', 
      value: stats.animals, 
      icon: '🐄', 
      link: '/admin/animals', 
      gradient: 'from-orange-500 to-amber-600',
      bgLight: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200'
    },
    { 
      title: 'Bookings', 
      value: stats.bookings, 
      icon: '📅', 
      link: '/admin/bookings', 
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    { 
      title: 'Users', 
      value: stats.users, 
      icon: '👥', 
      link: '/admin/users', 
      gradient: 'from-purple-500 to-violet-600',
      bgLight: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200'
    },
    { 
      title: 'Pending', 
      value: stats.pendingBookings, 
      icon: '⏳', 
      link: '/admin/bookings', 
      gradient: 'from-yellow-500 to-orange-500',
      bgLight: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    { 
      title: 'Revenue', 
      value: `Rs. ${stats.revenue.toLocaleString()}`, 
      icon: '💰', 
      link: '/admin/bookings', 
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const quickActions = [
    { label: 'Add Product', icon: '➕', link: '/admin/products', gradient: 'from-green-600 to-emerald-600' },
    { label: 'Add Animal', icon: '🐄', link: '/admin/animals', gradient: 'from-orange-500 to-amber-600' },
    { label: 'View Bookings', icon: '📋', link: '/admin/bookings', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Manage Users', icon: '👥', link: '/admin/users', gradient: 'from-purple-500 to-violet-600' }
  ];

  const managementCards = [
    { 
      title: 'Products', 
      description: 'Add, edit, and manage farm products',
      icon: '🥬',
      link: '/admin/products',
      stats: `${stats.products} items`,
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      title: 'Animals', 
      description: 'Manage livestock and animal inventory',
      icon: '🐄',
      link: '/admin/animals',
      stats: `${stats.animals} animals`,
      gradient: 'from-orange-500 to-amber-600'
    },
    { 
      title: 'Bookings', 
      description: 'Track and manage customer orders',
      icon: '📅',
      link: '/admin/bookings',
      stats: `${stats.pendingBookings} pending`,
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      title: 'Users', 
      description: 'View and manage customer accounts',
      icon: '👥',
      link: '/admin/users',
      stats: `${stats.users} registered`,
      gradient: 'from-purple-500 to-violet-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-green-800 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your farm.</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, index) => (
            <Link
              key={card.title}
              to={card.link}
              className={`group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border ${card.borderColor} overflow-hidden`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgLight} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">⚡</span>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className={`group bg-gradient-to-r ${action.gradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2`}
              >
                <span className="text-lg">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Management Cards */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">🛠️</span>
          Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {managementCards.map((card, index) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
              
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors">{card.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{card.description}</p>
                  <p className="text-green-600 font-medium text-sm mt-2">{card.stats}</p>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}