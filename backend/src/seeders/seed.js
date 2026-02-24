import bcrypt from 'bcryptjs';
import { connectDB, sequelize } from '../database/db.js';
import { User, Product, Animal, Booking, Review, Recipe, syncDatabase } from '../models/index.js';

const seedData = async () => {
  await connectDB();
  await syncDatabase();

  try {
    console.log('🌱 Starting seed...\n');

    // Clear existing data (in correct order for foreign keys)
    await Review.destroy({ where: {}, force: true });
    await Booking.destroy({ where: {}, force: true });
    await Recipe.destroy({ where: {}, force: true });
    console.log('🗑️  Cleared existing bookings, reviews & recipes');

    // ──────────────── USERS ────────────────
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);
    const customerPassword = await bcrypt.hash('User@12345', 10);

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@agrofarm.com' },
      defaults: {
        name: 'Farm Admin',
        email: 'admin@agrofarm.com',
        phone: '9812345678',
        password: hashedPassword,
        role: 'admin',
        address: 'Agrofarm HQ, Baluwatar, Kathmandu',
        is_verified: true,
      },
    });

    const [sita] = await User.findOrCreate({
      where: { email: 'sita.sharma@gmail.com' },
      defaults: {
        name: 'Sita Sharma',
        email: 'sita.sharma@gmail.com',
        phone: '9841234567',
        password: customerPassword,
        role: 'customer',
        address: 'Baneshwor-10, Kathmandu',
        is_verified: true,
      },
    });

    const [ram] = await User.findOrCreate({
      where: { email: 'ram.kc@gmail.com' },
      defaults: {
        name: 'Ram KC',
        email: 'ram.kc@gmail.com',
        phone: '9807654321',
        password: customerPassword,
        role: 'customer',
        address: 'Jawalakhel-5, Lalitpur',
        is_verified: true,
      },
    });

    const [anita] = await User.findOrCreate({
      where: { email: 'anita.thapa@gmail.com' },
      defaults: {
        name: 'Anita Thapa',
        email: 'anita.thapa@gmail.com',
        phone: '9860123456',
        password: customerPassword,
        role: 'customer',
        address: 'Thapathali-11, Kathmandu',
        is_verified: true,
      },
    });

    const [bikash] = await User.findOrCreate({
      where: { email: 'bikash.gurung@gmail.com' },
      defaults: {
        name: 'Bikash Gurung',
        email: 'bikash.gurung@gmail.com',
        phone: '9823456789',
        password: customerPassword,
        role: 'customer',
        address: 'Bhaktapur-6, Bhaktapur',
        is_verified: true,
      },
    });

    console.log('✅ Users created (1 admin + 4 customers)');

    // ──────────────── PRODUCTS ────────────────
    const productsData = [
      // Dairy
      { name: 'Fresh Milk', emoji: '🥛', price: 60, unit: 'per liter', stock: 50, category: 'dairy', description: 'Farm-fresh organic cow milk, delivered daily. Rich in calcium and vitamins.', season: 'Year-round' },
      { name: 'Curd (Dahi)', emoji: '🥣', price: 80, unit: 'per liter', stock: 30, category: 'dairy', description: 'Thick, creamy homemade curd made from pure cow milk. Perfect for rice or lassi.', season: 'Year-round' },
      { name: 'Paneer', emoji: '🧀', price: 450, unit: 'per kg', stock: 15, category: 'dairy', description: 'Fresh cottage cheese made from whole milk. Great for curries and tikka.', season: 'Year-round' },
      { name: 'Ghee', emoji: '🫕', price: 1200, unit: 'per liter', stock: 10, category: 'dairy', description: 'Pure desi cow ghee, slow-cooked. Rich aroma and golden color.', season: 'Year-round' },
      { name: 'Farm Eggs', emoji: '🥚', price: 8, unit: 'per piece', stock: 200, category: 'dairy', description: 'Free-range farm eggs from healthy hens. High in protein and omega-3.', season: 'Year-round' },

      // Vegetables
      { name: 'Tomatoes', emoji: '🍅', price: 40, unit: 'per kg', stock: 35, category: 'vegetables', description: 'Vine-ripened organic tomatoes. Juicy and full of flavor.', season: 'Summer', availability_start: '04-01', availability_end: '09-30' },
      { name: 'Potatoes', emoji: '🥔', price: 30, unit: 'per kg', stock: 60, category: 'vegetables', description: 'Fresh farm potatoes, perfect for curries, fries and momos.', season: 'Year-round' },
      { name: 'Spinach (Palungo)', emoji: '🥬', price: 25, unit: 'per bundle', stock: 40, category: 'vegetables', description: 'Fresh leafy spinach, rich in iron. Great for saag and salads.', season: 'Winter', availability_start: '10-01', availability_end: '03-31' },
      { name: 'Carrots', emoji: '🥕', price: 35, unit: 'per kg', stock: 25, category: 'vegetables', description: 'Sweet crunchy carrots, freshly harvested. Rich in beta-carotene.', season: 'Winter', availability_start: '10-01', availability_end: '02-28' },
      { name: 'Cauliflower', emoji: '🥦', price: 45, unit: 'per piece', stock: 20, category: 'vegetables', description: 'Fresh organic cauliflower. Perfect for gobi ko tarkari and achar.', season: 'Winter', availability_start: '10-01', availability_end: '02-28' },
      { name: 'Green Beans', emoji: '🫘', price: 50, unit: 'per kg', stock: 18, category: 'vegetables', description: 'Tender green beans, freshly picked. Great for stir-fry and curry.', season: 'Summer', availability_start: '05-01', availability_end: '09-30' },
      { name: 'Onions', emoji: '🧅', price: 35, unit: 'per kg', stock: 50, category: 'vegetables', description: 'Farm fresh onions, essential for Nepali cooking.', season: 'Year-round' },
      { name: 'Garlic', emoji: '🧄', price: 200, unit: 'per kg', stock: 15, category: 'vegetables', description: 'Organic garlic bulbs with strong flavor. Great for health and cooking.', season: 'Year-round' },
      { name: 'Radish (Mula)', emoji: '🌱', price: 20, unit: 'per kg', stock: 30, category: 'vegetables', description: 'White radish, perfect for mula ko achar and tareko mula.', season: 'Winter', availability_start: '10-01', availability_end: '02-28' },
      { name: 'Bitter Gourd (Karela)', emoji: '🥒', price: 55, unit: 'per kg', stock: 12, category: 'vegetables', description: 'Fresh bitter gourd. Known for its health benefits, especially for diabetes.', season: 'Summer', availability_start: '04-01', availability_end: '09-30' },
      { name: 'Pumpkin', emoji: '🎃', price: 25, unit: 'per kg', stock: 10, category: 'vegetables', description: 'Sweet farm pumpkin. Perfect for curry, soup and halwa.', season: 'Fall', availability_start: '09-01', availability_end: '12-31' },

      // Fruits
      { name: 'Bananas', emoji: '🍌', price: 60, unit: 'per dozen', stock: 30, category: 'fruits', description: 'Sweet ripe bananas from our farm. Great for snacking and smoothies.', season: 'Year-round' },
      { name: 'Oranges (Suntala)', emoji: '🍊', price: 80, unit: 'per kg', stock: 25, category: 'fruits', description: 'Juicy mandarin oranges from the hills. Sweet and tangy.', season: 'Winter', availability_start: '11-01', availability_end: '02-28' },
      { name: 'Guava (Amba)', emoji: '🍈', price: 60, unit: 'per kg', stock: 20, category: 'fruits', description: 'Fresh farm guavas. Rich in Vitamin C and fiber.', season: 'Winter', availability_start: '10-01', availability_end: '01-31' },
      { name: 'Papaya (Mewa)', emoji: '🍈', price: 45, unit: 'per kg', stock: 15, category: 'fruits', description: 'Ripe papaya from organic farms. Great for digestion and smoothies.', season: 'Summer', availability_start: '05-01', availability_end: '10-31' },
      { name: 'Mango (Aap)', emoji: '🥭', price: 120, unit: 'per kg', stock: 0, category: 'fruits', description: 'Sweet Nepali mangoes. The king of fruits! Available in season only.', season: 'Summer', availability_start: '06-01', availability_end: '08-31', is_available: false },

      // Grains
      { name: 'Basmati Rice', emoji: '🍚', price: 120, unit: 'per kg', stock: 100, category: 'grains', description: 'Premium long-grain basmati rice. Aromatic and fluffy when cooked.', season: 'Year-round' },
      { name: 'Wheat Flour (Atta)', emoji: '🌾', price: 55, unit: 'per kg', stock: 80, category: 'grains', description: 'Stone-ground whole wheat flour. Perfect for making roti and chapati.', season: 'Year-round' },
      { name: 'Maize (Makai)', emoji: '🌽', price: 40, unit: 'per kg', stock: 40, category: 'grains', description: 'Dried maize kernels. Can be ground into flour for dhido or roasted.', season: 'Fall', availability_start: '09-01', availability_end: '12-31' },
      { name: 'Lentils (Masoor Dal)', emoji: '🫘', price: 160, unit: 'per kg', stock: 50, category: 'grains', description: 'Red lentils, essential for Nepali dal bhat. Quick cooking and nutritious.', season: 'Year-round' },

      // Meat
      { name: 'Fresh Chicken', emoji: '🍗', price: 380, unit: 'per kg', stock: 15, category: 'meat', description: 'Farm-raised free-range chicken. No antibiotics or growth hormones.', season: 'Year-round' },
      { name: 'Goat Meat (Khasi ko Masu)', emoji: '🥩', price: 850, unit: 'per kg', stock: 8, category: 'meat', description: 'Fresh goat meat from farm-raised goats. Premium quality for curry.', season: 'Year-round' },
    ];

    const createdProducts = [];
    for (const p of productsData) {
      const [product] = await Product.findOrCreate({ where: { name: p.name }, defaults: p });
      createdProducts.push(product);
    }
    console.log(`✅ ${createdProducts.length} Products created`);

    // ──────────────── ANIMALS ────────────────
    const animalsData = [
      { name: 'Desi Cow (Lal Sindhi)', emoji: '🐄', age: '3 years', weight: '350 kg', price: 85000, quantity: 2, description: 'Healthy Lal Sindhi cow, gives 8-10 liters of milk daily. Well-vaccinated and dewormed.' },
      { name: 'Holstein Friesian Cow', emoji: '🐄', age: '4 years', weight: '500 kg', price: 150000, quantity: 1, description: 'High-yield Holstein Friesian cow. Produces 15-20 liters of milk daily. Excellent for dairy farming.' },
      { name: 'Jersey Cow', emoji: '🐄', age: '2.5 years', weight: '400 kg', price: 120000, quantity: 2, description: 'Jersey breed cow known for rich, creamy milk. Docile temperament. Recently calved.' },
      { name: 'Male Buffalo (Bhainsi)', emoji: '🐃', age: '5 years', weight: '600 kg', price: 200000, quantity: 1, description: 'Strong healthy male buffalo. Suitable for breeding or farming purposes.' },
      { name: 'Female Buffalo (Bhainsi)', emoji: '🐃', age: '4 years', weight: '450 kg', price: 180000, quantity: 2, description: 'Murrah buffalo, gives 6-8 liters of rich milk daily. Ideal for ghee production.' },
      { name: 'Boer Goat', emoji: '🐐', age: '1.5 years', weight: '35 kg', price: 15000, quantity: 6, description: 'Healthy Boer goat, excellent for meat. Fast-growing breed with good build.' },
      { name: 'Jamunapari Goat', emoji: '🐐', age: '2 years', weight: '28 kg', price: 12000, quantity: 4, description: 'Dual-purpose Jamunapari goat. Good for both milk and meat production.' },
      { name: 'Khari Goat', emoji: '🐐', age: '1 year', weight: '18 kg', price: 8000, quantity: 8, description: 'Local Khari breed goat. Hardy and disease-resistant. Easy to maintain.' },
      { name: 'Desi Hen (Kukhura)', emoji: '🐔', age: '8 months', weight: '2 kg', price: 600, quantity: 30, description: 'Free-range local hens. Lay 200+ eggs per year. Organic fed.' },
      { name: 'Broiler Chicken', emoji: '🐔', age: '6 weeks', weight: '2.5 kg', price: 400, quantity: 50, description: 'Farm-raised broiler chickens. Ready for meat. Antibiotic-free.' },
      { name: 'Duck (Hans)', emoji: '🦆', age: '6 months', weight: '3 kg', price: 800, quantity: 10, description: 'Healthy ducks for eggs and meat. Low maintenance and disease resistant.' },
      { name: 'Pig (Sungur)', emoji: '🐷', age: '8 months', weight: '60 kg', price: 18000, quantity: 3, description: 'Hampshire cross pig. Well-fed and healthy. Ready for sale.' },
      { name: 'Rabbit (Kharayo)', emoji: '🐰', age: '4 months', weight: '2 kg', price: 1500, quantity: 8, description: 'New Zealand White rabbits. Great as pets or for breeding.' },
    ];

    const createdAnimals = [];
    for (const a of animalsData) {
      const [animal] = await Animal.findOrCreate({ where: { name: a.name }, defaults: a });
      createdAnimals.push(animal);
    }
    console.log(`✅ ${createdAnimals.length} Animals created`);

    // ──────────────── BOOKINGS (Sita - across many months) ────────────────
    // Helper to set createdAt to a specific month
    const monthDate = (monthsAgo) => {
      const d = new Date();
      d.setMonth(d.getMonth() - monthsAgo);
      d.setDate(Math.floor(Math.random() * 20) + 1);
      return d;
    };

    const startDate = (monthsAgo) => {
      const d = monthDate(monthsAgo);
      return d.toISOString().split('T')[0];
    };

    // Product lookup helper
    const findProduct = (name) => createdProducts.find(p => p.name === name);
    const findAnimal = (name) => createdAnimals.find(a => a.name === name);

    const sitaBookings = [
      // 11 months ago - completed milk order
      { user_id: sita.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 2, schedule_type: 'daily', start_date: startDate(11), end_date: startDate(10), delivery_time: 'morning', status: 'completed', total_price: 3600, notes: 'Please deliver before 7 AM' },
      // 10 months ago - completed eggs
      { user_id: sita.id, product_id: findProduct('Farm Eggs')?.id, booking_type: 'product', quantity: 30, schedule_type: 'once', start_date: startDate(10), end_date: startDate(10), delivery_time: 'morning', status: 'completed', total_price: 240, notes: '' },
      // 9 months ago - completed veggies
      { user_id: sita.id, product_id: findProduct('Tomatoes')?.id, booking_type: 'product', quantity: 3, schedule_type: 'weekly', start_date: startDate(9), end_date: startDate(8), delivery_time: 'afternoon', status: 'completed', total_price: 480, notes: 'Fresh ones please' },
      { user_id: sita.id, product_id: findProduct('Potatoes')?.id, booking_type: 'product', quantity: 5, schedule_type: 'once', start_date: startDate(9), end_date: startDate(9), delivery_time: 'morning', status: 'completed', total_price: 150 },
      // 8 months ago - completed
      { user_id: sita.id, product_id: findProduct('Basmati Rice')?.id, booking_type: 'product', quantity: 10, schedule_type: 'once', start_date: startDate(8), end_date: startDate(8), delivery_time: 'morning', status: 'completed', total_price: 1200, notes: 'Need for family event' },
      { user_id: sita.id, product_id: findProduct('Paneer')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(8), end_date: startDate(8), delivery_time: 'afternoon', status: 'completed', total_price: 900 },
      // 7 months ago
      { user_id: sita.id, product_id: findProduct('Ghee')?.id, booking_type: 'product', quantity: 1, schedule_type: 'once', start_date: startDate(7), end_date: startDate(7), delivery_time: 'morning', status: 'completed', total_price: 1200 },
      { user_id: sita.id, product_id: findProduct('Fresh Chicken')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(7), end_date: startDate(7), delivery_time: 'evening', status: 'completed', total_price: 760 },
      // 6 months ago
      { user_id: sita.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 1, schedule_type: 'daily', start_date: startDate(6), end_date: startDate(5), delivery_time: 'morning', status: 'completed', total_price: 1800 },
      { user_id: sita.id, product_id: findProduct('Curd (Dahi)')?.id, booking_type: 'product', quantity: 2, schedule_type: 'weekly', start_date: startDate(6), end_date: startDate(5), delivery_time: 'morning', status: 'completed', total_price: 640 },
      // 5 months ago
      { user_id: sita.id, product_id: findProduct('Lentils (Masoor Dal)')?.id, booking_type: 'product', quantity: 5, schedule_type: 'once', start_date: startDate(5), end_date: startDate(5), delivery_time: 'afternoon', status: 'completed', total_price: 800 },
      { user_id: sita.id, product_id: findProduct('Wheat Flour (Atta)')?.id, booking_type: 'product', quantity: 10, schedule_type: 'once', start_date: startDate(5), end_date: startDate(5), delivery_time: 'morning', status: 'completed', total_price: 550 },
      // 4 months ago
      { user_id: sita.id, product_id: findProduct('Goat Meat (Khasi ko Masu)')?.id, booking_type: 'product', quantity: 3, schedule_type: 'once', start_date: startDate(4), end_date: startDate(4), delivery_time: 'morning', status: 'completed', total_price: 2550, notes: 'For family gathering' },
      { user_id: sita.id, product_id: findProduct('Onions')?.id, booking_type: 'product', quantity: 5, schedule_type: 'once', start_date: startDate(4), end_date: startDate(4), delivery_time: 'afternoon', status: 'completed', total_price: 175 },
      // 3 months ago
      { user_id: sita.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 2, schedule_type: 'daily', start_date: startDate(3), end_date: startDate(2), delivery_time: 'morning', status: 'completed', total_price: 3600 },
      { user_id: sita.id, product_id: findProduct('Carrots')?.id, booking_type: 'product', quantity: 3, schedule_type: 'once', start_date: startDate(3), end_date: startDate(3), delivery_time: 'morning', status: 'completed', total_price: 105 },
      // 2 months ago
      { user_id: sita.id, product_id: findProduct('Spinach (Palungo)')?.id, booking_type: 'product', quantity: 4, schedule_type: 'weekly', start_date: startDate(2), end_date: startDate(1), delivery_time: 'morning', status: 'completed', total_price: 400 },
      { user_id: sita.id, product_id: findProduct('Cauliflower')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(2), end_date: startDate(2), delivery_time: 'afternoon', status: 'completed', total_price: 90 },
      // 1 month ago
      { user_id: sita.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 1, schedule_type: 'daily', start_date: startDate(1), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 1800, notes: 'Morning delivery preferred' },
      { user_id: sita.id, product_id: findProduct('Farm Eggs')?.id, booking_type: 'product', quantity: 12, schedule_type: 'weekly', start_date: startDate(1), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 384 },
      // Current month - pending/approved
      { user_id: sita.id, product_id: findProduct('Bananas')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'afternoon', status: 'pending', total_price: 120 },
      { user_id: sita.id, product_id: findProduct('Guava (Amba)')?.id, booking_type: 'product', quantity: 3, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'morning', status: 'approved', total_price: 180 },
      // Animal enquiry
      { user_id: sita.id, animal_id: findAnimal('Khari Goat')?.id, booking_type: 'animal', quantity: 2, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'morning', status: 'pending', total_price: 16000, notes: 'Interested in 2 healthy ones for our farm' },
    ];

    // Ram's bookings (fewer, different months)
    const ramBookings = [
      { user_id: ram.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 1, schedule_type: 'daily', start_date: startDate(6), end_date: startDate(5), delivery_time: 'morning', status: 'completed', total_price: 1800 },
      { user_id: ram.id, product_id: findProduct('Basmati Rice')?.id, booking_type: 'product', quantity: 25, schedule_type: 'once', start_date: startDate(4), end_date: startDate(4), delivery_time: 'morning', status: 'completed', total_price: 3000, notes: 'For restaurant supply' },
      { user_id: ram.id, product_id: findProduct('Potatoes')?.id, booking_type: 'product', quantity: 20, schedule_type: 'monthly', start_date: startDate(3), end_date: startDate(0), delivery_time: 'afternoon', status: 'active', total_price: 1800 },
      { user_id: ram.id, product_id: findProduct('Fresh Chicken')?.id, booking_type: 'product', quantity: 5, schedule_type: 'weekly', start_date: startDate(2), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 15200, notes: 'Bulk order for restaurant' },
      { user_id: ram.id, product_id: findProduct('Goat Meat (Khasi ko Masu)')?.id, booking_type: 'product', quantity: 5, schedule_type: 'once', start_date: startDate(1), end_date: startDate(1), delivery_time: 'morning', status: 'completed', total_price: 4250 },
      { user_id: ram.id, product_id: findProduct('Garlic')?.id, booking_type: 'product', quantity: 3, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'afternoon', status: 'pending', total_price: 600 },
      { user_id: ram.id, animal_id: findAnimal('Boer Goat')?.id, booking_type: 'animal', quantity: 3, schedule_type: 'once', start_date: startDate(3), end_date: startDate(3), delivery_time: 'morning', status: 'completed', total_price: 45000, notes: 'For Dashain festival' },
    ];

    // Anita's bookings
    const anitaBookings = [
      { user_id: anita.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 1, schedule_type: 'daily', start_date: startDate(2), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 3600 },
      { user_id: anita.id, product_id: findProduct('Farm Eggs')?.id, booking_type: 'product', quantity: 6, schedule_type: 'weekly', start_date: startDate(2), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 192 },
      { user_id: anita.id, product_id: findProduct('Curd (Dahi)')?.id, booking_type: 'product', quantity: 1, schedule_type: 'weekly', start_date: startDate(1), end_date: startDate(0), delivery_time: 'morning', status: 'approved', total_price: 320 },
      { user_id: anita.id, product_id: findProduct('Oranges (Suntala)')?.id, booking_type: 'product', quantity: 5, schedule_type: 'once', start_date: startDate(1), end_date: startDate(1), delivery_time: 'afternoon', status: 'completed', total_price: 400 },
      { user_id: anita.id, product_id: findProduct('Paneer')?.id, booking_type: 'product', quantity: 1, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'evening', status: 'pending', total_price: 450, notes: 'For weekend cooking' },
      { user_id: anita.id, animal_id: findAnimal('Desi Hen (Kukhura)')?.id, booking_type: 'animal', quantity: 5, schedule_type: 'once', start_date: startDate(1), end_date: startDate(1), delivery_time: 'morning', status: 'approved', total_price: 3000, notes: 'Want healthy laying hens for my backyard' },
    ];

    // Bikash's bookings
    const bikashBookings = [
      { user_id: bikash.id, product_id: findProduct('Ghee')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(5), end_date: startDate(5), delivery_time: 'morning', status: 'completed', total_price: 2400 },
      { user_id: bikash.id, product_id: findProduct('Wheat Flour (Atta)')?.id, booking_type: 'product', quantity: 20, schedule_type: 'monthly', start_date: startDate(4), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 4400 },
      { user_id: bikash.id, product_id: findProduct('Maize (Makai)')?.id, booking_type: 'product', quantity: 10, schedule_type: 'once', start_date: startDate(3), end_date: startDate(3), delivery_time: 'afternoon', status: 'completed', total_price: 400 },
      { user_id: bikash.id, product_id: findProduct('Fresh Milk')?.id, booking_type: 'product', quantity: 2, schedule_type: 'daily', start_date: startDate(1), end_date: startDate(0), delivery_time: 'morning', status: 'active', total_price: 3600 },
      { user_id: bikash.id, product_id: findProduct('Green Beans')?.id, booking_type: 'product', quantity: 2, schedule_type: 'once', start_date: startDate(0), end_date: startDate(0), delivery_time: 'morning', status: 'pending', total_price: 100 },
      { user_id: bikash.id, animal_id: findAnimal('Jersey Cow')?.id, booking_type: 'animal', quantity: 1, schedule_type: 'once', start_date: startDate(2), end_date: startDate(2), delivery_time: 'morning', status: 'completed', total_price: 120000, notes: 'Want to start dairy farming at home' },
      // Cancelled booking
      { user_id: bikash.id, product_id: findProduct('Pumpkin')?.id, booking_type: 'product', quantity: 3, schedule_type: 'once', start_date: startDate(1), end_date: startDate(1), delivery_time: 'afternoon', status: 'cancelled', total_price: 75, notes: 'Changed my mind' },
    ];

    const allBookings = [...sitaBookings, ...ramBookings, ...anitaBookings, ...bikashBookings];

    for (const b of allBookings) {
      if (!b.product_id && !b.animal_id) continue; // skip if product/animal not found
      const booking = await Booking.create(b);
      // Set createdAt to match the start_date month for realistic chart data
      const bookingDate = new Date(b.start_date);
      bookingDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
      await sequelize.query(
        `UPDATE bookings SET "createdAt" = :date WHERE id = :id`,
        { replacements: { date: bookingDate.toISOString(), id: booking.id } }
      );
    }
    console.log(`✅ ${allBookings.length} Bookings created across multiple months`);

    // ──────────────── REVIEWS ────────────────
    const reviewsData = [
      // Sita's reviews
      { user_id: sita.id, product_id: findProduct('Fresh Milk')?.id, rating: 5, comment: 'Best milk in Kathmandu! So fresh and creamy. My kids love it. Been ordering daily for months now.', admin_reply: 'Thank you Sita ji! We are glad your family enjoys our fresh milk. 🥛', admin_reply_at: new Date() },
      { user_id: sita.id, product_id: findProduct('Farm Eggs')?.id, rating: 5, comment: 'These eggs taste so different from store-bought ones. The yolk is deep orange - you can tell the hens are healthy!', admin_reply: 'Yes! Our hens are free-range and organic fed. Thank you for noticing the quality! 🥚', admin_reply_at: new Date() },
      { user_id: sita.id, product_id: findProduct('Tomatoes')?.id, rating: 4, comment: 'Very fresh tomatoes, vine-ripened taste. Sometimes a few are overripe though.', admin_reply: 'Thank you for the feedback! We will sort more carefully. Please let us know if it happens again.', admin_reply_at: new Date() },
      { user_id: sita.id, product_id: findProduct('Ghee')?.id, rating: 5, comment: 'Pure desi ghee! The aroma is amazing. My mother-in-law approved it instantly 😄', admin_reply: null, admin_reply_at: null },
      { user_id: sita.id, product_id: findProduct('Basmati Rice')?.id, rating: 4, comment: 'Good quality rice. Grains are long and cook up fluffy. Price is fair.', admin_reply: null, admin_reply_at: null },
      { user_id: sita.id, product_id: findProduct('Paneer')?.id, rating: 5, comment: 'Softest paneer I have ever had! Made amazing paneer butter masala with it.', admin_reply: 'So happy to hear that! Our paneer is made fresh the same morning. 🧀', admin_reply_at: new Date() },

      // Ram's reviews
      { user_id: ram.id, product_id: findProduct('Fresh Milk')?.id, rating: 4, comment: 'Quality is consistent for my restaurant needs. Daily delivery is reliable too.', admin_reply: 'Thank you Ram ji! We always prioritize our bulk customers. 🙏', admin_reply_at: new Date() },
      { user_id: ram.id, product_id: findProduct('Fresh Chicken')?.id, rating: 5, comment: 'The best chicken for my restaurant. Customers can taste the difference! Clean, fresh, no bad smell.', admin_reply: 'Thank you for choosing our farm-raised chicken for your restaurant! 🍗', admin_reply_at: new Date() },
      { user_id: ram.id, product_id: findProduct('Potatoes')?.id, rating: 4, comment: 'Good size potatoes, no dirt. Works well for our momo filling and aloo tarkari.', admin_reply: null, admin_reply_at: null },
      { user_id: ram.id, product_id: findProduct('Goat Meat (Khasi ko Masu)')?.id, rating: 5, comment: 'Excellent quality khasi meat. Tender and fresh. Our customers loved the Dashain special menu!', admin_reply: 'Happy Dashain Ram ji! Glad our meat made your festival special. 🎉', admin_reply_at: new Date() },
      { user_id: ram.id, product_id: findProduct('Basmati Rice')?.id, rating: 5, comment: 'We switched to this rice for our restaurant and customers noticed the improvement. Top quality!', admin_reply: null, admin_reply_at: null },

      // Anita's reviews
      { user_id: anita.id, product_id: findProduct('Fresh Milk')?.id, rating: 5, comment: 'Pure and unadulterated milk. I can make perfect dahi at home with this. Delivery is always on time!', admin_reply: null, admin_reply_at: null },
      { user_id: anita.id, product_id: findProduct('Curd (Dahi)')?.id, rating: 5, comment: 'Thick creamy dahi, better than anything in the market. My family finishes it in one sitting!', admin_reply: 'Haha, we take that as the biggest compliment! Thank you Anita ji 😊', admin_reply_at: new Date() },
      { user_id: anita.id, product_id: findProduct('Oranges (Suntala)')?.id, rating: 4, comment: 'Sweet and juicy suntala. Reminded me of my village. Just wish the delivery packaging was better for fruits.', admin_reply: 'Thank you for the suggestion! We are improving our fruit packaging. 🍊', admin_reply_at: new Date() },
      { user_id: anita.id, product_id: findProduct('Farm Eggs')?.id, rating: 4, comment: 'Good quality eggs. One was broken during delivery once, but they replaced it promptly.', admin_reply: 'Sorry about the breakage! We have added extra padding to egg deliveries now. 📦', admin_reply_at: new Date() },

      // Bikash's reviews
      { user_id: bikash.id, product_id: findProduct('Ghee')?.id, rating: 5, comment: 'This ghee is gold! The taste takes me back to my grandmother village. Worth every rupee.', admin_reply: 'That means the world to us! Traditional taste is what we strive for. 💛', admin_reply_at: new Date() },
      { user_id: bikash.id, product_id: findProduct('Wheat Flour (Atta)')?.id, rating: 4, comment: 'Good quality atta. Roti comes out soft and tasty. Monthly delivery is very convenient.', admin_reply: null, admin_reply_at: null },
      { user_id: bikash.id, product_id: findProduct('Fresh Milk')?.id, rating: 5, comment: 'Switched from packaged milk to this and never going back. You can literally taste the freshness!', admin_reply: 'Welcome to the fresh milk family, Bikash ji! 🥛✨', admin_reply_at: new Date() },
      { user_id: bikash.id, product_id: findProduct('Maize (Makai)')?.id, rating: 4, comment: 'Good quality maize. Made dhido and poleko makai - turned out great. Would like more stock availability.', admin_reply: 'Thank you! Maize is seasonal but we try to keep stock. Will increase next season! 🌽', admin_reply_at: new Date() },
      { user_id: bikash.id, product_id: findProduct('Green Beans')?.id, rating: 3, comment: 'Beans were okay but some were a bit old. Expected fresher ones at this price.', admin_reply: 'Sorry about that Bikash ji. We will ensure better quality next time. Your satisfaction matters to us!', admin_reply_at: new Date() },
    ];

    for (const r of reviewsData) {
      if (!r.product_id) continue;
      await Review.findOrCreate({
        where: { user_id: r.user_id, product_id: r.product_id },
        defaults: r,
      });
    }
    console.log(`✅ ${reviewsData.length} Reviews created (with admin replies)`);

    // ──────────────── RECIPES ────────────────
    const recipesData = [
      {
        user_id: sita.id,
        title: 'Nepali Dal Bhat',
        description: 'The classic Nepali staple meal - hearty lentil soup served with steamed rice, seasonal vegetables, and achar. A complete nutritious meal enjoyed across Nepal.',
        ingredients: JSON.stringify(['2 cups masoor dal', '4 cups basmati rice', '1 onion chopped', '2 tomatoes', '3 cloves garlic', '1 inch ginger', '1 tsp turmeric', '1 tsp cumin seeds', 'Salt to taste', 'Ghee for tempering', 'Fresh coriander for garnish']),
        instructions: '1. Wash and soak dal for 30 minutes.\n2. Cook rice in rice cooker or pot until fluffy.\n3. Pressure cook dal with turmeric, salt and water for 3-4 whistles.\n4. In a pan, heat ghee. Add cumin seeds, let them splutter.\n5. Add chopped onion, garlic and ginger. Sauté until golden.\n6. Add chopped tomatoes and cook until soft.\n7. Pour the tempering into cooked dal. Mix well.\n8. Garnish with fresh coriander.\n9. Serve hot dal over steamed rice with pickle on the side.',
        prep_time: 15,
        cook_time: 40,
        servings: 4,
        category: 'Main Course',
        difficulty: 'Easy',
      },
      {
        user_id: sita.id,
        title: 'Paneer Butter Masala',
        description: 'Rich and creamy paneer curry made with fresh farm paneer and aromatic spices. A family favorite that goes perfectly with naan or rice.',
        ingredients: JSON.stringify(['250g fresh paneer', '3 tomatoes', '1 onion', '10 cashews', '2 tbsp butter', '1 cup cream', '1 tsp garam masala', '1 tsp red chilli powder', '1 tsp kasuri methi', 'Salt to taste', '1 inch ginger', '3 cloves garlic']),
        instructions: '1. Blanch tomatoes and blend with cashews, onion, ginger and garlic into smooth paste.\n2. Heat butter in a pan. Pour the tomato paste and cook for 10 minutes.\n3. Add salt, red chilli powder and garam masala. Cook on low heat.\n4. Add cream and mix well. Simmer for 5 minutes.\n5. Cut paneer into cubes and add to the gravy.\n6. Cook for 3-4 minutes on low heat.\n7. Crush kasuri methi and sprinkle on top.\n8. Finish with a dollop of butter.\n9. Serve hot with naan or jeera rice.',
        prep_time: 20,
        cook_time: 30,
        servings: 3,
        category: 'Main Course',
        difficulty: 'Medium',
      },
      {
        user_id: ram.id,
        title: 'Chicken Chhoila',
        description: 'A popular Newari appetizer made with grilled chicken marinated in mustard oil and spices. Smoky, spicy and absolutely delicious!',
        ingredients: JSON.stringify(['500g chicken breast', '3 tbsp mustard oil', '2 tsp timur (Sichuan pepper)', '4 green chillies', '1 inch ginger', '4 cloves garlic', '1 onion sliced', 'Fresh coriander', 'Lemon juice', 'Salt to taste']),
        instructions: '1. Grill or roast whole chicken breast until cooked through and slightly charred.\n2. Let it cool and shred into thin strips.\n3. Grind timur, green chillies, ginger and garlic into a coarse paste.\n4. Heat mustard oil until smoking, then let it cool slightly.\n5. Mix shredded chicken with the spice paste.\n6. Add mustard oil, sliced onions and salt. Toss well.\n7. Squeeze lemon juice and garnish with coriander.\n8. Serve as appetizer with chiura (beaten rice).',
        prep_time: 15,
        cook_time: 20,
        servings: 4,
        category: 'Side Dish',
        difficulty: 'Medium',
      },
      {
        user_id: ram.id,
        title: 'Farm Fresh Egg Curry',
        description: 'Simple yet flavorful egg curry using our farm-fresh eggs. A protein-packed meal that is ready in under 30 minutes!',
        ingredients: JSON.stringify(['6 farm eggs', '2 onions', '3 tomatoes', '2 green chillies', '1 tsp turmeric', '1 tsp cumin powder', '1 tsp coriander powder', 'Oil', 'Salt to taste', 'Coriander leaves']),
        instructions: '1. Hard boil the eggs for 10 minutes. Peel and make small cuts on surface.\n2. Lightly fry the eggs in oil until golden. Set aside.\n3. In the same pan, sauté chopped onions until golden brown.\n4. Add tomatoes and green chillies. Cook until tomatoes are mushy.\n5. Add all spice powders and salt. Cook for 2 minutes.\n6. Add water to make gravy consistency.\n7. Simmer for 5 minutes, then add the fried eggs.\n8. Cook for another 5 minutes so eggs absorb the flavors.\n9. Garnish with fresh coriander. Serve with rice or roti.',
        prep_time: 10,
        cook_time: 25,
        servings: 3,
        category: 'Main Course',
        difficulty: 'Easy',
      },
      {
        user_id: anita.id,
        title: 'Seasonal Vegetable Salad',
        description: 'A refreshing and healthy salad made with seasonal farm vegetables. Light, crunchy and perfect for summer days.',
        ingredients: JSON.stringify(['1 cucumber', '2 carrots', '1 cup green beans blanched', '2 tomatoes', '1 onion', '1 lemon juice', '2 tbsp olive oil', 'Salt and pepper', 'Fresh mint leaves', '1 tsp roasted cumin powder']),
        instructions: '1. Wash and chop all vegetables into bite-size pieces.\n2. Blanch green beans in boiling water for 2 minutes, then dunk in ice water.\n3. In a large bowl, combine all chopped vegetables.\n4. Make dressing: mix lemon juice, olive oil, salt, pepper and cumin powder.\n5. Pour dressing over vegetables and toss gently.\n6. Garnish with fresh mint leaves.\n7. Refrigerate for 15 minutes before serving.\n8. Best enjoyed fresh as a side with any meal.',
        prep_time: 15,
        cook_time: 5,
        servings: 4,
        category: 'Salad',
        difficulty: 'Easy',
      },
      {
        user_id: anita.id,
        title: 'Pumpkin Soup (Pharsi ko Jhol)',
        description: 'A warming Nepali-style pumpkin soup with ginger and spices. Comfort food for cold winter evenings.',
        ingredients: JSON.stringify(['500g pumpkin cubed', '1 onion', '2 cloves garlic', '1 inch ginger', '1 tsp cumin', '1/2 tsp turmeric', '2 cups water', '1/2 cup cream', 'Salt to taste', 'Roasted pumpkin seeds for garnish']),
        instructions: '1. Heat oil in pot. Sauté onion, garlic and ginger until fragrant.\n2. Add cumin and turmeric, cook for 30 seconds.\n3. Add pumpkin cubes and water. Bring to boil.\n4. Simmer for 20 minutes until pumpkin is very soft.\n5. Blend everything until smooth using immersion blender.\n6. Return to heat, add cream and salt. Stir well.\n7. Simmer for 5 more minutes.\n8. Serve in bowls topped with a swirl of cream and pumpkin seeds.',
        prep_time: 10,
        cook_time: 30,
        servings: 4,
        category: 'Soup',
        difficulty: 'Easy',
      },
      {
        user_id: bikash.id,
        title: 'Dhido with Gundruk',
        description: 'Traditional Nepali dhido made with maize flour, served with gundruk ko jhol (fermented greens soup). A hearty mountain meal.',
        ingredients: JSON.stringify(['2 cups maize flour (makai ko pitho)', '3 cups water', 'For gundruk jhol:', '1 cup gundruk', '2 tomatoes', '2 green chillies', '1 tsp turmeric', 'Salt to taste', '1 onion', 'Timur to taste']),
        instructions: '1. For Dhido: Boil 3 cups water in a heavy pot.\n2. Slowly add maize flour while stirring continuously with a wooden stick (dabilo).\n3. Keep stirring vigorously to prevent lumps. Cook on low heat for 15-20 minutes.\n4. The dhido is ready when it pulls away from the sides of the pot.\n5. For Gundruk Jhol: Soak gundruk for 10 minutes, squeeze out water.\n6. Sauté onion, add tomatoes and spices.\n7. Add gundruk and water. Simmer for 15 minutes.\n8. Season with timur and salt.\n9. Serve dhido with gundruk jhol and chilli pickle.',
        prep_time: 10,
        cook_time: 35,
        servings: 2,
        category: 'Main Course',
        difficulty: 'Medium',
      },
      {
        user_id: bikash.id,
        title: 'Fresh Milk Kheer',
        description: 'Creamy rice pudding made with fresh farm milk, flavored with cardamom and topped with nuts. A beloved Nepali dessert for celebrations.',
        ingredients: JSON.stringify(['1 liter fresh milk', '1/2 cup basmati rice soaked', '1/2 cup sugar', '4 cardamom pods', 'A pinch of saffron', '2 tbsp ghee', 'Chopped almonds and pistachios', 'Raisins']),
        instructions: '1. Wash and soak rice for 30 minutes.\n2. Boil milk in a heavy bottom pan, stirring occasionally.\n3. Once milk reduces slightly, add soaked rice.\n4. Cook on low heat, stirring frequently, for 30-35 minutes until rice is completely soft.\n5. Add sugar, crushed cardamom and saffron. Mix well.\n6. Add ghee and cook for 5 more minutes.\n7. Garnish with chopped nuts and raisins.\n8. Serve warm or chilled - both are delicious!',
        prep_time: 35,
        cook_time: 45,
        servings: 6,
        category: 'Dessert',
        difficulty: 'Easy',
      },
      {
        user_id: sita.id,
        title: 'Aloo Tama (Bamboo Shoot Curry)',
        description: 'A classic Nepali curry with potatoes and fermented bamboo shoots. Tangy, hearty, and uniquely Nepali.',
        ingredients: JSON.stringify(['200g tama (bamboo shoots)', '3 medium potatoes', '1 cup black-eyed peas soaked', '2 tomatoes', '1 tsp turmeric', '1 tsp cumin', 'Salt to taste', 'Oil', 'Fresh coriander']),
        instructions: '1. Soak tama in water for 1 hour to reduce sourness. Drain.\n2. Boil black-eyed peas until tender (about 20 min).\n3. Peel and cube potatoes.\n4. Heat oil, add cumin seeds. Add tomatoes and cook until soft.\n5. Add turmeric, salt and the tama. Stir fry for 5 minutes.\n6. Add potatoes and cooked black-eyed peas.\n7. Add water to cover and simmer for 20 minutes until potatoes are tender.\n8. Garnish with coriander. Serve with steamed rice.',
        prep_time: 70,
        cook_time: 40,
        servings: 4,
        category: 'Main Course',
        difficulty: 'Medium',
      },
      {
        user_id: anita.id,
        title: 'Carrot Halwa (Gajar ko Halwa)',
        description: 'A rich and indulgent Nepali dessert made with grated carrots slow-cooked in fresh milk and ghee. Perfect for winter!',
        ingredients: JSON.stringify(['500g carrots grated', '1 liter fresh milk', '1/2 cup sugar', '3 tbsp ghee', '4 cardamom pods crushed', 'Chopped cashews and almonds', 'Raisins']),
        instructions: '1. Heat ghee in a heavy pan. Add grated carrots and sauté for 5 minutes.\n2. Pour in the milk and cook on medium heat, stirring occasionally.\n3. Keep cooking until all milk is absorbed (about 40 minutes).\n4. Add sugar and cardamom. Mix well and cook for 10 more minutes.\n5. The halwa should be thick and leaving the sides of the pan.\n6. Add dry fruits and mix.\n7. Serve warm, garnished with extra nuts.',
        prep_time: 15,
        cook_time: 55,
        servings: 6,
        category: 'Dessert',
        difficulty: 'Medium',
      },
    ];

    for (const recipe of recipesData) {
      await Recipe.findOrCreate({
        where: { title: recipe.title, user_id: recipe.user_id },
        defaults: recipe,
      });
    }
    console.log(`✅ ${recipesData.length} Recipes created`);

    // ──────────────── SUMMARY ────────────────
    console.log('\n🌾 ═══════════════════════════════════════');
    console.log('   SEEDING COMPLETE!');
    console.log('   ─────────────────────────────────────');
    console.log(`   👤 Users:    5 (1 admin + 4 customers)`);
    console.log(`   🥬 Products: ${createdProducts.length}`);
    console.log(`   🐄 Animals:  ${createdAnimals.length}`);
    console.log(`   📦 Bookings: ${allBookings.length} (across 12 months)`);
    console.log(`   ⭐ Reviews:  ${reviewsData.length} (with admin replies)`);
    console.log(`   🍳 Recipes:  ${recipesData.length}`);
    console.log('   ─────────────────────────────────────');
    console.log('   Login credentials:');
    console.log('   Admin:    admin@agrofarm.com / Admin@12345');
    console.log('   Customer: sita.sharma@gmail.com / User@12345');
    console.log('   Customer: ram.kc@gmail.com / User@12345');
    console.log('   Customer: anita.thapa@gmail.com / User@12345');
    console.log('   Customer: bikash.gurung@gmail.com / User@12345');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();