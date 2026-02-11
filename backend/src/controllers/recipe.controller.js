import { Recipe, User } from '../models/index.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    
    let whereClause = {};
    
    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const recipes = await Recipe.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single recipe
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create recipe
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings, category, difficulty } = req.body;
    
    // Validate required fields
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, description, ingredients, and instructions are required' });
    }
    
    // Parse ingredients if it's a string
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        // If not valid JSON, split by newlines
        parsedIngredients = ingredients.split('\n').filter(i => i.trim());
      }
    }
    
    const recipeData = {
      user_id: req.user.id,
      title,
      description,
      ingredients: parsedIngredients,
      instructions,
      prep_time: prep_time ? parseInt(prep_time) : null,
      cook_time: cook_time ? parseInt(cook_time) : null,
      servings: servings ? parseInt(servings) : 4,
      category: category || 'Other',
      difficulty: difficulty || 'Medium',
      image: req.file ? `/uploads/${req.file.filename}` : null
    };
    
    const recipe = await Recipe.create(recipeData);
    
    res.status(201).json({ message: 'Recipe created successfully!', recipe });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user owns this recipe or is admin
    if (recipe.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, ingredients, instructions, prep_time, cook_time, servings, category, difficulty } = req.body;
    
    // Parse ingredients if it's a string
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        parsedIngredients = ingredients.split('\n').filter(i => i.trim());
      }
    }
    
    // Handle image update
    let image = recipe.image;
    if (req.file) {
      // Delete old image if exists
      if (recipe.image) {
        const oldImagePath = path.join(process.cwd(), recipe.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }
    
    await recipe.update({
      title,
      description,
      ingredients: parsedIngredients,
      instructions,
      prep_time: prep_time ? parseInt(prep_time) : recipe.prep_time,
      cook_time: cook_time ? parseInt(cook_time) : recipe.cook_time,
      servings: servings ? parseInt(servings) : recipe.servings,
      category: category || recipe.category,
      difficulty: difficulty || recipe.difficulty,
      image
    });
    
    res.json({ message: 'Recipe updated successfully!', recipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user owns this recipe or is admin
    if (recipe.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete image if exists
    if (recipe.image) {
      const imagePath = path.join(process.cwd(), recipe.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await recipe.destroy();
    
    res.json({ message: 'Recipe deleted successfully!' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's recipes
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(recipes);
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, getUserRecipes };
