import { Product } from '../../Model/index.js';
import fs from 'fs';
import path from 'path';

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_available: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product with image
const createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, stock, category, emoji } = req.body;

    // Get image path if uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      unit,
      stock: parseInt(stock),
      category,
      emoji,
      image
    });

    res.status(201).json({ message: 'Product created!', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product with image
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, unit, stock, category, emoji } = req.body;

    // Handle image update
    let image = product.image;
    if (req.file) {
      // Delete old image if exists
      if (product.image) {
        const oldImagePath = path.join(process.cwd(), product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await product.update({
      name,
      description,
      price: parseFloat(price),
      unit,
      stock: parseInt(stock),
      category,
      emoji,
      image
    });

    res.json({ message: 'Product updated!', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();
    res.json({ message: 'Product deleted!' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };