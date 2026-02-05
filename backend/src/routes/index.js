import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import animalRoutes from './animal.routes.js';
import bookingRoutes from './booking.routes.js';
import reviewRoutes from './review.routes.js';
import userRoutes from './user.routes.js';
import recipeRoutes from './recipe.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/animals', animalRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);

export default router;
