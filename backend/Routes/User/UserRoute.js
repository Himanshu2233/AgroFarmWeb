import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  getUserStats
} from '../../Controller/User/UserController.js';
import { authMiddleware, adminMiddleware } from '../../Middleware/token-middleware.js';

const router = express.Router();

// All routes require admin access
router.use(authMiddleware, adminMiddleware);

// User management routes
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/change-role', changeUserRole);

export default router;