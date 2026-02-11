import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../api/productService.js';
import { getAllAnimals } from '../../api/animalService.js';
import { getAllBookings } from '../../api/bookingService.js';
import { getAllUsers } from '../../api/userService.js';
import { useScrollToTop, useDocumentTitle } from '../../utils';
import { useToast } from '../../contexts';

export default function AdminDashboard() {
  useScrollToTop();
  useDocumentTitle('Admin Dashboard');
  const toast = useToast();
  const [stats, setStats] = useState({
    products: 0,
    animals: 0,
    bookings: 0,
    users: 0,
    pendingBookings: 0,
    revenue: 0
  });
  const [rawData, setRawData] = useState({
    products: [],
    animals: [],
    bookings: [],
    users: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, animals, bookings, users] = await Promise.all([
        getAllProducts().catch(() => []),
        getAllAnimals().catch(() => []),
        getAllBookings().catch(() => []),
        getAllUsers().catch(() => [])
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

      setRawData({
        products,
        animals,
        bookings,
        users
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate chart data
  const chartData = useMemo(() => {
    const { products, animals, bookings, users } = rawData;
    
    // Booking status distribution
    const bookingsByStatus = [
      { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#F59E0B' },
      { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length, color: '#3B82F6' },
      { label: 'Active', value: bookings.filter(b => b.status === 'active').length, color: '#10B981' },
      { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: '#6B7280' },
      { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#EF4444' },
    ].filter(item => item.value > 0);

    // Product categories distribution
    const categoryCount = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryColors = {
      vegetables: '#10B981',
      fruits: '#F59E0B',
      dairy: '#3B82F6',
      grains: '#8B5CF6',
      eggs: '#EC4899',
      other: '#6B7280'
    };
    
    const productsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      icon: category === 'vegetables' ? '🥬' : category === 'fruits' ? '🍎' : category === 'dairy' ? '🥛' : category === 'grains' ? '🌾' : category === 'eggs' ? '🥚' : '📦',
      color: categoryColors[category] || '#6B7280'
    }));

    // User stats
    const activeUsers = users.filter(u => u.is_active).length;
    const verifiedUsers = users.filter(u => u.is_verified).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    
    // Revenue by type
    const productRevenue = bookings
      .filter(b => b.booking_type !== 'animal' && b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0);
    const animalRevenue = bookings
      .filter(b => b.booking_type === 'animal' && b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    // Recent bookings trend (last 7 days based on actual data)
    const now = new Date();
    const recentBookingsTrend = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() - (6 - i));
      const dayStr = day.toISOString().slice(0, 10);
      return bookings.filter(b => b.createdAt?.slice(0, 10) === dayStr).length;
    });

    // Stock status
    const inStock = products.filter(p => p.stock > 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return {
      bookingsByStatus,
      productsByCategory,
      userStats: { total: users.length, active: activeUsers, verified: verifiedUsers, admins: adminUsers },
      revenueByType: [
        { label: 'Products', value: productRevenue, color: '#10B981', icon: '🥬' },
        { label: 'Animals', value: animalRevenue, color: '#F59E0B', icon: '🐄' }
      ],
      recentBookingsTrend,
      stockStatus: [
        { label: 'In Stock', value: inStock, color: '#10B981' },
        { label: 'Low Stock', value: lowStock, color: '#F59E0B' },
        { label: 'Out of Stock', value: outOfStock, color: '#EF4444' }
      ]
    };
  }, [rawData]);

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
    },
    { 
      title: 'Recipes', 
      description: 'Manage user-shared recipes',
      icon: '🍽️',
      link: '/admin/recipes',
      stats: 'Community shared',
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      title: 'Reviews', 
      description: 'View and reply to customer reviews',
      icon: '⭐',
      link: '/admin/reviews',
      stats: 'Customer feedback',
      gradient: 'from-amber-500 to-orange-600'
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

        {/* Infographics Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Booking Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">📊</span>
              Booking Status
            </h3>
            <div className="space-y-3 mt-4">
              {chartData.bookingsByStatus.map((item, index) => (
                <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: `${item.color}20` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / chartData.bookingsByStatus.reduce((sum, i) => sum + i.value, 0)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products by Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">🥬</span>
              Products by Category
            </h3>
            <div className="space-y-3 mt-4">
              {chartData.productsByCategory.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 font-medium text-gray-700">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / Math.max(...chartData.productsByCategory.map(i => i.value))) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Split */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">💰</span>
              Revenue by Type
            </h3>
            <div className="space-y-4">
              {chartData.revenueByType.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 font-medium text-gray-700">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      Rs. {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / (chartData.revenueByType[0].value + chartData.revenueByType[1].value || 1)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Total Revenue</span>
                  <span className="text-2xl font-bold text-gray-800">
                    Rs. {stats.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row of Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">📦</span>
              Stock Status
            </h3>
            <div className="space-y-3 mt-4">
              {chartData.stockStatus.map((item, index) => (
                <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: `${item.color}20` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / chartData.stockStatus.reduce((sum, i) => sum + i.value, 0)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">👥</span>
              User Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <p className="text-3xl font-bold text-purple-700">{chartData.userStats.total}</p>
                <p className="text-purple-600 text-sm font-medium">Total Users</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <p className="text-3xl font-bold text-emerald-700">{chartData.userStats.active}</p>
                <p className="text-emerald-600 text-sm font-medium">Active Users</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <p className="text-3xl font-bold text-blue-700">{chartData.userStats.verified}</p>
                <p className="text-blue-600 text-sm font-medium">Verified</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <p className="text-3xl font-bold text-amber-700">{chartData.userStats.admins}</p>
                <p className="text-amber-600 text-sm font-medium">Admins</p>
              </div>
            </div>
            {/* Activity Trend */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Recent Activity Trend</span>
                <span className="text-xs text-gray-400">Last 7 days</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {chartData.recentBookingsTrend.map((value, index) => (
                  <div 
                    key={index}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all hover:from-purple-600 hover:to-purple-500"
                    style={{ 
                      height: `${(value / Math.max(...chartData.recentBookingsTrend)) * 100}%`,
                      minHeight: '8px'
                    }}
                    title={`Day ${index + 1}: ${value} bookings`}
                  />
                ))}
              </div>
            </div>
          </div>
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