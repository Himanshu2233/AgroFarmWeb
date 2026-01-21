import { sequelize } from '../Database/db.js';
import User from './User/UserModel.js';
import Product from './Product/productModel.js';
import Animal from './Animal/AnimalModel.js';
import Booking from './Booking/BookingModel.js';
import Review from './Review/ReviewModel.js';

// User -> Booking
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product -> Booking
Product.hasMany(Booking, { foreignKey: 'product_id', as: 'bookings' });
Booking.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Animal -> Booking (for animal enquiries)
Animal.hasMany(Booking, { foreignKey: 'animal_id', as: 'enquiries' });
Booking.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// User -> Review
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product -> Review
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ All tables synced!');
  } catch (error) {
    console.error('❌ Sync error:', error.message);
  }
};

export { User, Product, Animal, Booking, Review, syncDatabase };