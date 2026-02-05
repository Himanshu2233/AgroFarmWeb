import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteAccount
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/token.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/update-profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/upload-profile-image', authMiddleware, upload.single('profile_image'), uploadProfileImage);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;