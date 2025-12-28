import express from 'express';
import {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking
} from '../../Controller/Booking/BookingController.js';
import { authMiddleware, adminMiddleware } from '../../Middleware/token-middleware.js';

const router = express.Router();

// Customer routes
router.get('/my', authMiddleware, getMyBookings);
router.post('/', authMiddleware, createBooking);
router.put('/:id/cancel', authMiddleware, cancelBooking);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllBookings);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

export default router;