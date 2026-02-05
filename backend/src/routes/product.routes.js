import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/token.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes with image upload
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;