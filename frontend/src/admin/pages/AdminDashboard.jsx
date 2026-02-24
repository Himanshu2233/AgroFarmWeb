import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' });
      return { 
        value: bookings.filter(b => {
          if (!b.createdAt) return false;
          const c = new Date(b.createdAt);
          const cStr = `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, '0')}-${String(c.getDate()).padStart(2, '0')}`;
          return cStr === dayStr;
        }).length, 
        label: dayLabel 
      };
    });

    // Monthly revenue (last 12 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`; // YYYY-MM without UTC shift
      const rev = bookings
        .filter(b => {
          if (b.status === 'cancelled' || !b.createdAt) return false;
          const created = new Date(b.createdAt);
          const cYear = created.getFullYear();
          const cMonth = String(created.getMonth() + 1).padStart(2, '0');
          return `${cYear}-${cMonth}` === monthStr;
        })
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0);
      return { label: monthNames[d.getMonth()], value: rev, month: monthStr };
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
      monthlyRevenue,
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
    { label: 'Add Product', icon: '➕', link: '/admin/products', gradient: 'from-green-600 to-emerald-600', openForm: true },
    { label: 'Add Animal', icon: '🐄', link: '/admin/animals', gradient: 'from-orange-500 to-amber-600', openForm: true },
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">⚡</span>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.link, action.openForm ? { state: { openForm: true } } : undefined)}
                className={`group bg-gradient-to-r ${action.gradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer`}
              >
                <span className="text-lg">{action.icon}</span>
                {action.label}
              </button>
            ))}
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

        {/* Infographics Section - Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Booking Status - Donut Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">📊</span>
              Booking Status
            </h3>
            {chartData.bookingsByStatus.length > 0 ? (
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 160 160" className="w-40 h-40">
                  {(() => {
                    const total = chartData.bookingsByStatus.reduce((s, i) => s + i.value, 0);
                    let cumulative = 0;
                    return chartData.bookingsByStatus.map((item, idx) => {
                      const pct = item.value / total;
                      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      cumulative += pct;
                      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      const largeArc = pct > 0.5 ? 1 : 0;
                      const x1 = 80 + 60 * Math.cos(startAngle);
                      const y1 = 80 + 60 * Math.sin(startAngle);
                      const x2 = 80 + 60 * Math.cos(endAngle);
                      const y2 = 80 + 60 * Math.sin(endAngle);
                      const ix1 = 80 + 36 * Math.cos(endAngle);
                      const iy1 = 80 + 36 * Math.sin(endAngle);
                      const ix2 = 80 + 36 * Math.cos(startAngle);
                      const iy2 = 80 + 36 * Math.sin(startAngle);
                      return (
                        <path
                          key={idx}
                          d={`M ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 36 36 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
                          fill={item.color}
                          className="transition-all duration-300 hover:opacity-80"
                          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                        >
                          <title>{item.label}: {item.value}</title>
                        </path>
                      );
                    });
                  })()}
                  <text x="80" y="76" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937" fontSize="22">{chartData.bookingsByStatus.reduce((s, i) => s + i.value, 0)}</text>
                  <text x="80" y="96" textAnchor="middle" fill="#6b7280" fontSize="11">Total</text>
                </svg>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {chartData.bookingsByStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">No bookings yet</div>
            )}
          </div>

          {/* Products by Category - Horizontal Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">🥬</span>
              Products by Category
            </h3>
            {chartData.productsByCategory.length > 0 ? (
              <div className="space-y-4 mt-2">
                {chartData.productsByCategory.map((item, index) => {
                  const maxVal = Math.max(...chartData.productsByCategory.map(i => i.value));
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span className="text-lg">{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${(item.value / maxVal) * 100}%`,
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">No products yet</div>
            )}
          </div>

          {/* Revenue Split - Donut + Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">💰</span>
              Revenue Split
            </h3>
            {stats.revenue > 0 ? (
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 160 160" className="w-36 h-36">
                  {(() => {
                    const total = chartData.revenueByType.reduce((s, i) => s + i.value, 0) || 1;
                    let cumulative = 0;
                    return chartData.revenueByType.filter(i => i.value > 0).map((item, idx) => {
                      const pct = item.value / total;
                      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      cumulative += pct;
                      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      const largeArc = pct > 0.5 ? 1 : 0;
                      const x1 = 80 + 55 * Math.cos(startAngle);
                      const y1 = 80 + 55 * Math.sin(startAngle);
                      const x2 = 80 + 55 * Math.cos(endAngle);
                      const y2 = 80 + 55 * Math.sin(endAngle);
                      const ix1 = 80 + 35 * Math.cos(endAngle);
                      const iy1 = 80 + 35 * Math.sin(endAngle);
                      const ix2 = 80 + 35 * Math.cos(startAngle);
                      const iy2 = 80 + 35 * Math.sin(startAngle);
                      return (
                        <path
                          key={idx}
                          d={`M ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 35 35 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
                          fill={item.color}
                          className="transition-all duration-300 hover:opacity-80"
                        >
                          <title>{item.label}: Rs. {item.value.toLocaleString()}</title>
                        </path>
                      );
                    });
                  })()}
                  <text x="80" y="84" textAnchor="middle" fill="#1f2937" fontSize="11" fontWeight="600">Rs. {stats.revenue.toLocaleString()}</text>
                </svg>
                <div className="w-full space-y-3 mt-4">
                  {chartData.revenueByType.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${item.color}15` }}>
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="text-sm font-bold" style={{ color: item.color }}>Rs. {item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">No revenue yet</div>
            )}
          </div>
        </div>

        {/* Monthly Revenue Line Graph */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-lg flex items-center justify-center">📈</span>
            Monthly Revenue
          </h3>
          {(() => {
            const data = chartData.monthlyRevenue;
            const maxVal = Math.max(...data.map(d => d.value), 1);
            const svgW = 700;
            const svgH = 220;
            const padL = 60;
            const padR = 20;
            const padT = 20;
            const padB = 40;
            const chartW = svgW - padL - padR;
            const chartH = svgH - padT - padB;
            const points = data.map((d, i) => ({
              x: padL + (i / (data.length - 1)) * chartW,
              y: padT + chartH - (d.value / maxVal) * chartH,
              ...d
            }));
            const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;
            // Y-axis gridlines
            const gridLines = 4;
            const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => {
              const val = (maxVal / gridLines) * i;
              const y = padT + chartH - (val / maxVal) * chartH;
              return { val, y };
            });

            return (
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-56" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="revLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                {/* Grid lines & Y labels */}
                {yTicks.map((tick, i) => (
                  <g key={i}>
                    <line x1={padL} y1={tick.y} x2={svgW - padR} y2={tick.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4 3"} />
                    <text x={padL - 8} y={tick.y + 4} textAnchor="end" fill="#9ca3af" fontSize="10">
                      {tick.val >= 1000 ? `${(tick.val / 1000).toFixed(tick.val >= 10000 ? 0 : 1)}k` : tick.val.toFixed(0)}
                    </text>
                  </g>
                ))}
                {/* Area fill */}
                <path d={areaPath} fill="url(#revAreaGrad)" />
                {/* Line */}
                <path d={linePath} fill="none" stroke="url(#revLineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Data points & X labels */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#10B981" strokeWidth="2" className="transition-all duration-200" />
                    <circle cx={p.x} cy={p.y} r="8" fill="transparent" className="cursor-pointer">
                      <title>{p.label}: Rs. {p.value.toLocaleString()}</title>
                    </circle>
                    {p.value > 0 && (
                      <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#059669" fontSize="9" fontWeight="600">
                        {p.value >= 1000 ? `${(p.value / 1000).toFixed(1)}k` : p.value}
                      </text>
                    )}
                    <text x={p.x} y={svgH - 10} textAnchor="middle" fill="#6b7280" fontSize="10">{p.label}</text>
                  </g>
                ))}
              </svg>
            );
          })()}
        </div>

        {/* Second Row of Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Status - Donut Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">📦</span>
              Stock Status
            </h3>
            {(() => {
              const total = chartData.stockStatus.reduce((s, i) => s + i.value, 0);
              if (total === 0) return <div className="flex items-center justify-center h-48 text-gray-400">No products yet</div>;
              let cumulative = 0;
              return (
                <div className="flex items-center gap-6">
                  <svg viewBox="0 0 140 140" className="w-36 h-36 flex-shrink-0">
                    {chartData.stockStatus.filter(i => i.value > 0).map((item, idx) => {
                      const pct = item.value / total;
                      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      cumulative += pct;
                      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
                      const largeArc = pct > 0.5 ? 1 : 0;
                      const x1 = 70 + 52 * Math.cos(startAngle);
                      const y1 = 70 + 52 * Math.sin(startAngle);
                      const x2 = 70 + 52 * Math.cos(endAngle);
                      const y2 = 70 + 52 * Math.sin(endAngle);
                      const ix1 = 70 + 32 * Math.cos(endAngle);
                      const iy1 = 70 + 32 * Math.sin(endAngle);
                      const ix2 = 70 + 32 * Math.cos(startAngle);
                      const iy2 = 70 + 32 * Math.sin(startAngle);
                      return (
                        <path
                          key={idx}
                          d={`M ${x1} ${y1} A 52 52 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 32 32 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
                          fill={item.color}
                          className="transition-all duration-300 hover:opacity-80"
                        >
                          <title>{item.label}: {item.value}</title>
                        </path>
                      );
                    })}
                    <text x="70" y="66" textAnchor="middle" fill="#1f2937" fontSize="20" fontWeight="bold">{total}</text>
                    <text x="70" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">Products</text>
                  </svg>
                  <div className="flex-1 space-y-3">
                    {chartData.stockStatus.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${item.color}15` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* User Overview + Activity Trend Area Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">👥</span>
              User Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <p className="text-2xl font-bold text-purple-700">{chartData.userStats.total}</p>
                <p className="text-purple-600 text-xs font-medium">Total Users</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-700">{chartData.userStats.active}</p>
                <p className="text-emerald-600 text-xs font-medium">Active Users</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <p className="text-2xl font-bold text-blue-700">{chartData.userStats.verified}</p>
                <p className="text-blue-600 text-xs font-medium">Verified</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <p className="text-2xl font-bold text-amber-700">{chartData.userStats.admins}</p>
                <p className="text-amber-600 text-xs font-medium">Admins</p>
              </div>
            </div>
            {/* Activity Trend - Area Chart */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Booking Activity</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Last 7 days</span>
              </div>
              {(() => {
                const data = chartData.recentBookingsTrend;
                const maxVal = Math.max(...data.map(d => d.value), 1);
                const w = 320;
                const h = 80;
                const padL = 5;
                const padR = 5;
                const padT = 10;
                const padB = 18;
                const cW = w - padL - padR;
                const cH = h - padT - padB;
                const pts = data.map((d, i) => ({
                  x: padL + (i / (data.length - 1)) * cW,
                  y: padT + cH - (d.value / maxVal) * cH,
                  ...d
                }));
                const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const area = `${line} L ${pts[pts.length - 1].x} ${padT + cH} L ${pts[0].x} ${padT + cH} Z`;
                return (
                  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="actAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill="url(#actAreaGrad)" />
                    <path d={line} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="1.5" />
                        <text x={p.x} y={h - 4} textAnchor="middle" fill="#9ca3af" fontSize="8">{p.label}</text>
                        <title>{p.label}: {p.value} bookings</title>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>
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