import express from 'express';
import {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal
} from '../../Controller/Animal/AnimalController.js';
import { authMiddleware, adminMiddleware } from '../../Middleware/token-middleware.js';
import upload from '../../Middleware/upload-middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);

// Admin routes with image upload
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createAnimal);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateAnimal);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAnimal);

export default router;