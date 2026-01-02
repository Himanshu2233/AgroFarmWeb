import { Booking, Product, User } from '../../Model/index.js';

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'emoji', 'price', 'unit']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'emoji', 'price', 'unit']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    // Admins cannot create bookings - they manage the platform
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admins cannot create bookings. Please use a customer account.' 
      });
    }

    const { product_id, quantity, schedule_type, start_date, end_date, delivery_time, notes } = req.body;

    // Validate required fields
    if (!product_id || !quantity || !schedule_type || !start_date) {
      return res.status(400).json({ message: 'Product, quantity, schedule type and start date are required' });
    }

    // Check product exists and has stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items available` });
    }

    // Calculate total price
    const total_price = product.price * quantity;

    // Create booking
    const booking = await Booking.create({
      user_id: req.user.id,
      product_id,
      quantity,
      schedule_type,
      start_date,
      end_date,
      delivery_time,
      total_price,
      notes,
      status: 'pending'
    });

    // Reduce stock
    await product.update({ stock: product.stock - quantity });

    res.status(201).json({
      message: 'Booking created successfully!',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ status });
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Restore stock
    const product = await Product.findByPk(booking.product_id);
    if (product) {
      await product.update({ stock: product.stock + booking.quantity });
    }

    await booking.update({ status: 'cancelled' });
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getMyBookings, getAllBookings, createBooking, updateBookingStatus, cancelBooking };