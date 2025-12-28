import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../Controller/Product/productController.js';
import { authMiddleware, adminMiddleware } from '../../Middleware/token-middleware.js';
import upload from '../../Middleware/upload-middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes with image upload
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;