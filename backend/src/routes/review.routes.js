import express from 'express';
import {
  getProductReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getProductRating
} from '../controllers/review.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/token.middleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/rating', getProductRating);

// Protected routes (login required)
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllReviews);

export default router;