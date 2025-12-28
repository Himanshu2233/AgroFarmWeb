import express from 'express';
import authRoutes from './Auth/AuthRoute.js';
import productRoutes from './Product/productRoutes.js';
import animalRoutes from './Animal/AnimalRoutes.js';
import bookingRoutes from './Booking/BookingRoutes.js';
import reviewRoutes from './Review/ReviewRoutes.js';
import userRoutes from './User/UserRoute.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/animals', animalRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);

export default router;