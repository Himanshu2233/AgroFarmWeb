import bcrypt from 'bcryptjs';
import { connectDB } from '../database/db.js';
import { User, Product, Animal, syncDatabase } from '../models/index.js';

const seedData = async () => {
  await connectDB();
  await syncDatabase();

  try {
    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@agrofarm.com' },
      defaults: {
        name: 'Farm Admin',
        email: 'admin@agrofarm.com',
        phone: '9812345678',
        password: hashedPassword,
        role: 'admin'
      }
    });
    console.log('✅ Admin created (admin@agrofarm.com / admin123)');

    // Create Products
    const products = [
      { name: 'Fresh Milk', emoji: '🥛', price: 60, unit: 'per liter', stock: 50, category: 'dairy' },
      { name: 'Farm Eggs', emoji: '🥚', price: 8, unit: 'per piece', stock: 100, category: 'dairy' },
      { name: 'Tomatoes', emoji: '🍅', price: 40, unit: 'per kg', stock: 25, category: 'vegetables' },
      { name: 'Potatoes', emoji: '🥔', price: 30, unit: 'per kg', stock: 40, category: 'vegetables' },
      { name: 'Spinach', emoji: '🥬', price: 25, unit: 'per bundle', stock: 30, category: 'vegetables' },
      { name: 'Carrots', emoji: '🥕', price: 35, unit: 'per kg', stock: 20, category: 'vegetables' }
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { name: p.name }, defaults: p });
    }
    console.log('✅ Products created');

    // Create Animals
    const animals = [
      { name: 'Desi Cow', emoji: '🐄', age: '3 years', weight: '350 kg', price: 45000, quantity: 2 },
      { name: 'Goat', emoji: '🐐', age: '1.5 years', weight: '25 kg', price: 8000, quantity: 5 },
      { name: 'Hen', emoji: '🐔', age: '8 months', weight: '2 kg', price: 500, quantity: 20 }
    ];

    for (const a of animals) {
      await Animal.findOrCreate({ where: { name: a.name }, defaults: a });
    }
    console.log('✅ Animals created');

    console.log('🌾 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();