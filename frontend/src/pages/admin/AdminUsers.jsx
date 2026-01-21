import { useState, useEffect } from 'react';
import { 
  getAllUsers, 
  getUserStats, 
  updateUser, 
  deleteUser, 
  toggleUserStatus, 
  changeUserRole 
} from '../../api/userService.js';
import BackButton from '../../components/common/BackButton.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    const confirmMsg = `Change this user to ${newRole}?`;
    
    if (!confirm(confirmMsg)) return;

    try {
      await changeUserRole(id, newRole);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await deleteUser(id);
      fetchData();
      alert('User deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      fetchData();
      alert('User updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active) ||
      (filterStatus === 'verified' && user.is_verified) ||
      (filterStatus === 'unverified' && !user.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-green-800 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/admin" label="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor all registered users</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
            <span>•</span>
            <span>{filteredUsers.length} of {users.length} users shown</span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 hover:border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 hover:border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
                  <p className="text-gray-500 text-sm font-medium">Active</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
                  <p className="text-gray-500 text-sm font-medium">Verified</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 hover:border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
                  <p className="text-gray-500 text-sm font-medium">Admins</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 hover:border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-600">{stats.customers}</p>
                  <p className="text-gray-500 text-sm font-medium">Customers</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🛒</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">🔍 Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">👤 Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">👑 Admin</option>
                <option value="customer">🛒 Customer</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">📊 Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">🟢 Active</option>
                <option value="inactive">🔴 Inactive</option>
                <option value="verified">✅ Verified</option>
                <option value="unverified">⏳ Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid gap-4">
          {filteredUsers.map((user, index) => (
            <div 
              key={user.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                        {user.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-full font-medium">
                            👑 Admin
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">{user.email}</p>
                      <p className="text-gray-400 text-xs">{user.phone || 'No phone added'}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      user.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      user.is_verified 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {user.is_verified ? '✓ Verified' : '⏳ Pending'}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="text-sm text-gray-500 md:text-right">
                    <p className="font-medium text-gray-600">Joined</p>
                    <p>{formatDate(user.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                      title="Edit User"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        user.is_active 
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                      }`}
                      title={user.is_active ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.is_active ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleChangeRole(user.id, user.role)}
                      className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-colors"
                      title="Change Role"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                      title="Delete User"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{editingUser.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Edit User</h2>
                      <p className="text-green-100 text-sm">ID: {editingUser.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
                    >
                      <option value="customer">🛒 Customer</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                    <select
                      value={editingUser.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.value === 'active' })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
                    >
                      <option value="active">🟢 Active</option>
                      <option value="inactive">🔴 Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={editingUser.is_verified}
                    onChange={(e) => setEditingUser({ ...editingUser, is_verified: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor="is_verified" className="text-gray-700 cursor-pointer select-none">
                    <span className="font-medium">Email Verified</span>
                    <p className="text-sm text-gray-500">User has confirmed their email address</p>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-green-500/25"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}