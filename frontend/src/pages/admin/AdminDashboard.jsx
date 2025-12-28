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

  const cards = [
    { title: 'Products', value: stats.products, emoji: '🥬', link: '/admin/products', color: 'bg-green-500' },
    { title: 'Animals', value: stats.animals, emoji: '🐄', link: '/admin/animals', color: 'bg-orange-500' },
    { title: 'Bookings', value: stats.bookings, emoji: '📅', link: '/admin/bookings', color: 'bg-blue-500' },
    { title: 'Users', value: stats.users, emoji: '👥', link: '/admin/users', color: 'bg-purple-500' },
    { title: 'Pending', value: stats.pendingBookings, emoji: '⏳', link: '/admin/bookings', color: 'bg-yellow-500' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, emoji: '💰', link: '/admin/bookings', color: 'bg-emerald-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">🛠️ Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`${card.color} text-white rounded-2xl p-4 shadow-lg hover:scale-105 transition`}
            >
              <div className="text-3xl mb-2">{card.emoji}</div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm opacity-90">{card.title}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/products"
              className="bg-green-800 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
            >
              ➕ Add Product
            </Link>
            <Link
              to="/admin/animals"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition"
            >
              ➕ Add Animal
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition"
            >
              📋 View Bookings
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/admin/products"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
          >
            <span className="text-4xl">🥬</span>
            <div>
              <h3 className="text-xl font-bold text-green-800">Manage Products</h3>
              <p className="text-gray-600">Add, edit, delete products</p>
            </div>
          </Link>

          <Link
            to="/admin/animals"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
          >
            <span className="text-4xl">🐄</span>
            <div>
              <h3 className="text-xl font-bold text-green-800">Manage Animals</h3>
              <p className="text-gray-600">Add, edit, delete animals</p>
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
          >
            <span className="text-4xl">📅</span>
            <div>
              <h3 className="text-xl font-bold text-green-800">Manage Bookings</h3>
              <p className="text-gray-600">View and update bookings</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
          >
            <span className="text-4xl">👥</span>
            <div>
              <h3 className="text-xl font-bold text-green-800">View Users</h3>
              <p className="text-gray-600">See registered users</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}