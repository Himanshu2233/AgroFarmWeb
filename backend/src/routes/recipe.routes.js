import express from 'express';
import {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getUserRecipes
} from '../controllers/recipe.controller.js';
import { authMiddleware } from '../middlewares/token.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllRecipes);

// Protected routes (must be before /:id to avoid matching)
router.get('/user/my-recipes', authMiddleware, getUserRecipes);

router.get('/:id', getRecipe);
router.post('/', authMiddleware, upload.single('image'), createRecipe);
router.put('/:id', authMiddleware, upload.single('image'), updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router;
