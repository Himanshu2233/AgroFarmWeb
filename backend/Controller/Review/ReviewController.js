import { Review, User, Product } from '../../Model/index.js';

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews (admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'emoji']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    // Validate
    if (!product_id || !rating) {
      return res.status(400).json({ message: 'Product and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existingReview) {
      // Update existing review
      await existingReview.update({ rating, comment });
      return res.json({ message: 'Review updated!', review: existingReview });
    }

    // Create new review
    const review = await Review.create({
      user_id: req.user.id,
      product_id,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted!', review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.update({ rating, comment });
    res.json({ message: 'Review updated!', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product average rating
const getProductRating = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.productId }
    });

    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / reviews.length).toFixed(1);

    res.json({
      average: parseFloat(average),
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getProductReviews, getAllReviews, createReview, updateReview, deleteReview, getProductRating };