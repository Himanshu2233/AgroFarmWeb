import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword 
} from '../../Controller/Auth/AuthController.js';
import { authMiddleware } from '../../Middleware/token-middleware.js';

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

export default router;