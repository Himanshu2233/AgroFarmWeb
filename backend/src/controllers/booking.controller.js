import { Booking, Product, User, Animal } from '../models/index.js';
import { sequelize } from '../database/db.js';

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'emoji', 'image', 'price', 'unit'],
          required: false
        },
        {
          model: Animal,
          as: 'animal',
          attributes: ['id', 'name', 'emoji', 'image', 'price', 'age', 'weight'],
          required: false
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
          attributes: ['id', 'name', 'email', 'phone', 'address', 'profile_image']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'emoji', 'image', 'price', 'unit'],
          required: false
        },
        {
          model: Animal,
          as: 'animal',
          attributes: ['id', 'name', 'emoji', 'image', 'price', 'age', 'weight'],
          required: false
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

    const { product_id, animal_id, quantity, schedule_type, start_date, end_date, delivery_time, notes

 } = req.body;

    // Determine booking type
    const isAnimalEnquiry = !!animal_id;
    const booking_type = isAnimalEnquiry ? 'animal' : 'product';

    // Validate required fields
    if (!quantity || !schedule_type || !start_date) {
      return res.status(400).json({ message: 'Quantity, schedule type and start date are required' });
    }

    if (!product_id && !animal_id) {
      return res.status(400).json({ message: 'Either product_id or animal_id is required' });
    }

    // Use transaction to prevent race conditions
    const t = await sequelize.transaction();
    try {
      let total_price = 0;
      let item = null;

      if (isAnimalEnquiry) {
        // Handle animal enquiry - lock the row
        item = await Animal.findByPk(animal_id, { lock: t.LOCK.UPDATE, transaction: t });
        if (!item) {
          await t.rollback();
          return res.status(404).json({ message: 'Animal not found' });
        }

        if (item.quantity < quantity) {
          await t.rollback();
          return res.status(400).json({ message: `Only ${item.quantity} animals available` });
        }

        total_price = item.price * quantity;

        const booking = await Booking.create({
          user_id: req.user.id,
          animal_id,
          product_id: null,
          booking_type,
          quantity,
          schedule_type,
          start_date,
          end_date: end_date || null,
          delivery_time,
          total_price,
          notes,
          status: 'pending'
        }, { transaction: t });

        await item.update({ quantity: item.quantity - quantity }, { transaction: t });
        await t.commit();

        res.status(201).json({
          message: 'Animal enquiry submitted successfully! We will contact you soon.',
          booking
        });
      } else {
        // Handle product booking - lock the row
        item = await Product.findByPk(product_id, { lock: t.LOCK.UPDATE, transaction: t });
        if (!item) {
          await t.rollback();
          return res.status(404).json({ message: 'Product not found' });
        }

        if (item.stock < quantity) {
          await t.rollback();
          return res.status(400).json({ message: `Only ${item.stock} items available` });
        }

        total_price = item.price * quantity;

        const booking = await Booking.create({
          user_id: req.user.id,
          product_id,
          animal_id: null,
          booking_type,
          quantity,
          schedule_type,
          start_date,
          end_date: end_date || null,
          delivery_time,
          total_price,
          notes,
          status: 'pending'
        }, { transaction: t });

        await item.update({ stock: item.stock - quantity }, { transaction: t });
        await t.commit();

        res.status(201).json({
          message: 'Booking created successfully!',
          booking
        });
      }
    } catch (innerError) {
      await t.rollback();
      throw innerError;
    }
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'active', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Prevent updating already cancelled or completed bookings
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot update a cancelled booking' });
    }
    if (booking.status === 'completed' && status !== 'completed') {
      return res.status(400).json({ message: 'Cannot change status of a completed booking' });
    }

    // Restore stock/quantity when cancelling
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      if (booking.booking_type === 'animal' && booking.animal_id) {
        const animal = await Animal.findByPk(booking.animal_id);
        if (animal) {
          await animal.update({ quantity: animal.quantity + booking.quantity });
        }
      } else if (booking.product_id) {
        const product = await Product.findByPk(booking.product_id);
        if (product) {
          await product.update({ stock: product.stock + booking.quantity });
        }
      }
    }

    await booking.update({ status });
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
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

    // Prevent double cancellation
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Restore stock/quantity based on booking type
    if (booking.booking_type === 'animal' && booking.animal_id) {
      const animal = await Animal.findByPk(booking.animal_id);
      if (animal) {
        await animal.update({ quantity: animal.quantity + booking.quantity });
      }
    } else if (booking.product_id) {
      const product = await Product.findByPk(booking.product_id);
      if (product) {
        await product.update({ stock: product.stock + booking.quantity });
      }
    }

    await booking.update({ status: 'cancelled' });
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getMyBookings, getAllBookings, createBooking, updateBookingStatus, cancelBooking };