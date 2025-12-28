import bcrypt from 'bcryptjs';
import { User, Booking, Review } from '../../Model/index.js';

// Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'verification_token', 'reset_token', 'verification_expires', 'reset_expires'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_token'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, is_active, is_verified } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === user.id && is_active === false) {
      return res.status(400).json({ message: 'You cannot deactivate yourself' });
    }

    // Prevent changing own role
    if (req.user.id === user.id && role !== user.role) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    // Check if email already exists (if changing)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      role: role || user.role,
      is_active: is_active !== undefined ? is_active : user.is_active,
      is_verified: is_verified !== undefined ? is_verified : user.is_verified
    });

    res.json({ 
      message: 'User updated successfully!', 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle user active status (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }

    await user.update({ is_active: !user.is_active });

    res.json({ 
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully!`,
      is_active: user.is_active
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change user role (Admin)
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    await user.update({ role });

    res.json({ 
      message: `User role changed to ${role}!`,
      role: user.role
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats (Admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const verifiedUsers = await User.count({ where: { is_verified: true } });
    const adminUsers = await User.count({ where: { role: 'admin' } });
    const customerUsers = await User.count({ where: { role: 'customer' } });

    res.json({
      total: totalUsers,
      active: activeUsers,
      verified: verifiedUsers,
      admins: adminUsers,
      customers: customerUsers
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleUserStatus, 
  changeUserRole,
  getUserStats 
};