import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useToast } from '../../contexts';
import { useZodForm, useDocumentTitle } from '../../utils';
import { updateProfileSchema, changePasswordSchema } from '../../public/schemas/auth.schema';
import API from '../../api/api.js';
import { BackButton, FormProvider, FormInput, FormTextarea, SubmitButton, useConfirm } from '../../components';
import { getMyBookings } from '../../api/bookingService';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StatsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Profile() {
  const { user, login, updateUser } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  useDocumentTitle('My Profile');
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, completedBookings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const fileInputRef = useRef(null);

  // Profile Form
  const profileMethods = useZodForm({
    schema: updateProfileSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  // Password Form
  const passwordMethods = useZodForm({
    schema: changePasswordSchema,
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      profileMethods.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      
      // Set profile image if exists
      if (user.profile_image) {
        setProfileImagePreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profile_image}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookings = await getMyBookings();
        setStats({
          totalBookings: bookings.length,
          activeBookings: bookings.filter(b => ['pending', 'approved', 'active'].includes(b.status)).length,
          completedBookings: bookings.filter(b => b.status === 'completed').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileUpdate = async (data) => {
    try {
      const response = await API.put('/auth/update-profile', data);
      updateUser(response.data.user);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await API.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      passwordMethods.reset();
      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please select a valid image file');
        return;
      }
      
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', profileImage);
      
      const response = await API.post('/auth/upload-profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update user and token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(response.data.user, response.data.token);
      } else {
        login(response.data.user, localStorage.getItem('token'));
      }
      
      setProfileImage(null);
      toast.success('Profile picture updated successfully!');
      showMessage('success', 'Profile picture updated!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Your Account?',
      message: 'This action cannot be undone. All your data, bookings, and profile information will be permanently removed.',
      confirmText: 'Delete Account',
      cancelText: 'Keep Account',
      variant: 'danger',
      showInput: true,
      inputPlaceholder: 'Type DELETE to confirm',
      inputMatch: 'DELETE',
    });

    if (!confirmed) {
      return;
    }
    
    try {
      await API.delete('/auth/delete-account');
      toast.success('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'password', label: 'Security', icon: <LockIcon /> },
    { id: 'stats', label: 'Activity', icon: <StatsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-16 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <BackButton label="Back to Home" className="text-white/80 hover:text-white mb-6" />
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-white/10 backdrop-blur-sm">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white text-green-600 p-2.5 rounded-xl shadow-lg hover:bg-green-50 transition-all transform hover:scale-105"
              >
                <CameraIcon />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-green-100 text-lg mb-3">{user?.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-100 border border-purple-400/30' 
                    : 'bg-white/20 text-white border border-white/30'
                }`}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                </span>
                
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${
                  user?.is_verified
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                    : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                }`}>
                  {user?.is_verified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>

              {/* Upload Image Button (if image selected) */}
              {profileImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="mt-4 px-6 py-2 bg-white text-green-600 font-medium rounded-xl hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading...' : 'Save Profile Picture'}
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">{loadingStats ? '-' : stats.totalBookings}</div>
                <div className="text-xs text-green-100">Total Orders</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-2xl font-bold">{loadingStats ? '-' : stats.activeBookings}</div>
                <div className="text-xs text-green-100">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{loadingStats ? '-' : stats.completedBookings}</div>
                <div className="text-xs text-green-100">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? '✓' : '⚠'}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 bg-white rounded-2xl p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <UserIcon />
                  Personal Information
                </h2>
                
                <FormProvider methods={profileMethods} onSubmit={handleProfileUpdate}>
                  <div className="space-y-5">
                    <FormInput
                      name="name"
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                    />

                    <FormInput
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />

                    <FormInput
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      helperText="Nepal mobile number (98 or 97)"
                      required
                    />

                    <FormTextarea
                      name="address"
                      label="Delivery Address"
                      placeholder="Enter your address in Kathmandu Valley (area, street, landmark)"
                      rows={3}
                      helperText="We deliver within Kathmandu Valley only"
                    />

                    <SubmitButton 
                      loading={profileMethods.formState.isSubmitting}
                      loadingText="Saving Changes..."
                    >
                      💾 Save Profile
                    </SubmitButton>
                  </div>
                </FormProvider>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <LockIcon />
                    Change Password
                  </h2>
                  
                  <FormProvider methods={passwordMethods} onSubmit={handlePasswordChange}>
                    <div className="space-y-5">
                      <FormInput
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        required
                      />

                      <FormInput
                        name="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        helperText="Min 6 characters with uppercase, lowercase & number"
                        required
                      />

                      <FormInput
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                        required
                      />

                      <SubmitButton 
                        loading={passwordMethods.formState.isSubmitting}
                        loadingText="Changing Password..."
                      >
                        🔒 Update Password
                      </SubmitButton>
                    </div>
                  </FormProvider>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-2xl shadow-lg border-2 border-red-200 p-8">
                  <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                    ⚠️ Danger Zone
                  </h3>
                  <p className="text-red-700 mb-4 text-sm">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon />
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* Activity/Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <StatsIcon />
                    Your Activity
                  </h2>

                  {loadingStats ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                      <p className="mt-4 text-gray-600">Loading your activity...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600">{stats.totalBookings}</div>
                        <div className="text-sm text-blue-700 mt-1">Total Bookings</div>
                        <div className="text-xs text-blue-600 mt-2">All time</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                        <div className="text-3xl font-bold text-orange-600">{stats.activeBookings}</div>
                        <div className="text-sm text-orange-700 mt-1">Active Orders</div>
                        <div className="text-xs text-orange-600 mt-2">In progress</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div className="text-3xl font-bold text-green-600">{stats.completedBookings}</div>
                        <div className="text-sm text-green-700 mt-1">Completed</div>
                        <div className="text-xs text-green-600 mt-2">Successfully delivered</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        to="/bookings"
                        className="p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">📦</div>
                        <div className="font-medium text-green-700">View Orders</div>
                      </Link>
                      <Link
                        to="/products"
                        className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">🛒</div>
                        <div className="font-medium text-orange-700">Shop Products</div>
                      </Link>
                      <Link
                        to="/animals"
                        className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">🐄</div>
                        <div className="font-medium text-blue-700">Browse Animals</div>
                      </Link>
                      <Link
                        to="/"
                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">🏠</div>
                        <div className="font-medium text-purple-700">Go Home</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                📋 Account Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Status</p>
                  <p className={`font-semibold mt-1 ${user?.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user?.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Type</p>
                  <p className="font-semibold text-gray-800 mt-1 capitalize">{user?.role || 'Customer'}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
                  <p className="font-mono text-sm text-gray-600 mt-1">#{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
              <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                💬 Need Help?
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Our support team is here to assist you with any questions or concerns.
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors">
                Contact Support
              </button>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep your profile updated for smooth deliveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Add a profile picture to personalize your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Track your orders in the Activity tab</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
