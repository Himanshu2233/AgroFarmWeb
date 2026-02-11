import { sequelize } from '../database/db.js';
import User from './user.model.js';
import Product from './product.model.js';
import Animal from './animal.model.js';
import Booking from './booking.model.js';
import Review from './review.model.js';
import Recipe from './recipe.model.js';

// User -> Booking
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product -> Booking
Product.hasMany(Booking, { foreignKey: 'product_id', as: 'bookings', onDelete: 'SET NULL' });
Booking.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Animal -> Booking (for animal enquiries)
Animal.hasMany(Booking, { foreignKey: 'animal_id', as: 'enquiries', onDelete: 'SET NULL' });
Booking.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// User -> Review
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product -> Review
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User -> Recipe
User.hasMany(Recipe, { foreignKey: 'user_id', as: 'recipes', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Sync database
const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ All tables synced!');
    }
  } catch (error) {
    console.error('❌ Sync error:', error.message);
    throw error;
  }
};

export { User, Product, Animal, Booking, Review, Recipe, syncDatabase };
