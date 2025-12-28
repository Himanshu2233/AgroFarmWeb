import { Animal } from '../../Model/index.js';
import fs from 'fs';
import path from 'path';

// Get all animals
const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.findAll({
      where: { is_available: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(animals);
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single animal
const getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create animal with image
const createAnimal = async (req, res) => {
  try {
    const { name, description, age, weight, price, quantity, emoji } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const animal = await Animal.create({
      name,
      description,
      age,
      weight,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      emoji,
      image
    });

    res.status(201).json({ message: 'Animal added!', animal });
  } catch (error) {
    console.error('Create animal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update animal with image
const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const { name, description, age, weight, price, quantity, emoji } = req.body;

    let image = animal.image;
    if (req.file) {
      // Delete old image
      if (animal.image) {
        const oldImagePath = path.join(process.cwd(), animal.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await animal.update({
      name,
      description,
      age,
      weight,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      emoji,
      image
    });

    res.json({ message: 'Animal updated!', animal });
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete animal
const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Delete image file
    if (animal.image) {
      const imagePath = path.join(process.cwd(), animal.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await animal.destroy();
    res.json({ message: 'Animal deleted!' });
  } catch (error) {
    console.error('Delete animal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };