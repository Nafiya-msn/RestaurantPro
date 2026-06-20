const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const sampleItems = [
    // Biryani
    { name: 'Chicken Biryani', category: 'Biryani', price: 12.99, available: true, description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.8, featured: true },
    { name: 'Beef Biryani', category: 'Biryani', price: 14.99, available: true, description: 'Tender beef pieces layered with spiced rice and saffron.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.9, featured: true },
    { name: 'Mutton Biryani', category: 'Biryani', price: 16.99, available: true, description: 'Slow-cooked mutton with basmati rice and traditional spice blend.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.8, featured: false },
    { name: 'Alfaham Biryani', category: 'Biryani', price: 15.99, available: true, description: 'Arabic-style grilled chicken biryani with special spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.7, featured: false },
    // Arabic
    { name: 'Mandi', category: 'Arabic', price: 18.99, available: true, description: 'Traditional Yemeni rice dish with tender meat and aromatic spices.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.9, featured: true },
    { name: 'Kuzhimandi', category: 'Arabic', price: 16.99, available: true, description: 'Malabar-style Arabic rice with chicken or mutton.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.8, featured: true },
    { name: 'Alfaham', category: 'Arabic', price: 14.99, available: true, description: 'Grilled chicken with Arabic spices and rice.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.7, featured: false },
    // Rice
    { name: 'Fried Rice', category: 'Rice', price: 7.99, available: true, description: 'Classic fried rice with vegetables and soy sauce.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.4, featured: false },
    { name: 'Chicken Fried Rice', category: 'Rice', price: 9.99, available: true, description: 'Rice stir-fried with chicken and vegetables.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.5, featured: false },
    { name: 'Schezwan Rice', category: 'Rice', price: 10.99, available: true, description: 'Spicy fried rice with Schezwan sauce and vegetables.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.6, featured: false },
    // Shawarma
    { name: 'Arabic Shawarma', category: 'Shawarma', price: 8.99, available: true, description: 'Traditional Arabic shawarma with garlic sauce and pickles.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.7, featured: true },
    { name: 'Plate Shawarma', category: 'Shawarma', price: 10.99, available: true, description: 'Shawarma served on plate with rice and salad.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.6, featured: false },
    { name: 'Mexican Shawarma', category: 'Shawarma', price: 9.49, available: true, description: 'Spicy Mexican-style shawarma with jalapeños.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.5, featured: false },
    // Burger
    { name: 'Chicken Burger', category: 'Burger', price: 9.99, available: true, description: 'Crispy chicken fillet with lettuce and mayo.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.6, featured: false },
    { name: 'Zinger Burger', category: 'Burger', price: 10.99, available: true, description: 'Spicy zinger chicken with crispy coating.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.7, featured: true },
    { name: 'Cheese Burger', category: 'Burger', price: 11.99, available: true, description: 'Double cheese with beef patty and special sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.8, featured: true },
    // Pizza
    { name: 'Margherita Pizza', category: 'Pizza', price: 11.99, available: true, description: 'Classic tomato sauce, mozzarella, and fresh basil.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.7, featured: true },
    { name: 'Chicken Pizza', category: 'Pizza', price: 13.99, available: true, description: 'Grilled chicken with bell peppers and mozzarella.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.8, featured: true },
    { name: 'Pepperoni Pizza', category: 'Pizza', price: 12.99, available: true, description: 'Loaded with pepperoni and melted cheese.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.6, featured: false },
    // Broast
    { name: 'Broast Quarter', category: 'Broast', price: 9.99, available: true, description: 'Crispy broast quarter with special spices.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.6, featured: false },
    { name: 'Broast Half', category: 'Broast', price: 14.99, available: true, description: 'Half chicken broast with fries and drink.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.7, featured: true },
    { name: 'Broast Full', category: 'Broast', price: 24.99, available: true, description: 'Full chicken broast with all sides and drinks.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.8, featured: true },
    // Snacks
    { name: 'Sandwich', category: 'Snacks', price: 5.99, available: true, description: 'Classic sandwich with fresh vegetables.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', rating: 4.3, featured: false },
    { name: 'Club Sandwich', category: 'Snacks', price: 7.99, available: true, description: 'Triple-decker with chicken, egg, and bacon.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', rating: 4.6, featured: false },
    { name: 'Nuggets', category: 'Snacks', price: 6.99, available: true, description: 'Crispy chicken nuggets with dipping sauce.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', rating: 4.5, featured: false },
    { name: 'French Fries', category: 'Snacks', price: 4.99, available: true, description: 'Golden crispy fries with salt.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', rating: 4.4, featured: false },
    // Juices
    { name: 'Mango Juice', category: 'Juices', price: 4.49, available: true, description: 'Sweet mango juice with real fruit pulp.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.8, featured: true },
    { name: 'Watermelon Juice', category: 'Juices', price: 3.99, available: true, description: 'Fresh watermelon juice, perfect for summer.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.7, featured: false },
    { name: 'Orange Juice', category: 'Juices', price: 3.99, available: true, description: 'Freshly squeezed orange juice.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.6, featured: false },
    { name: 'Avocado Juice', category: 'Juices', price: 5.49, available: true, description: 'Creamy avocado juice with honey.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.5, featured: false },
    // Desserts
    { name: 'Ice Cream', category: 'Desserts', price: 4.99, available: true, description: 'Creamy vanilla ice cream with toppings.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.6, featured: false },
    { name: 'Brownie', category: 'Desserts', price: 5.99, available: true, description: 'Warm chocolate brownie with nuts.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.7, featured: true },
    { name: 'Falooda', category: 'Desserts', price: 6.99, available: true, description: 'Traditional Indian dessert with vermicelli and ice cream.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.8, featured: true },
    { name: 'Kunafa', category: 'Desserts', price: 7.99, available: true, description: 'Middle Eastern sweet pastry with cheese.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.9, featured: true },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurantpro');
        console.log('Connected to MongoDB');

        // Clear existing items
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert sample items
        const inserted = await MenuItem.insertMany(sampleItems);
        console.log(`Seeded ${inserted.length} menu items successfully`);
        
        // Verify
        const count = await MenuItem.countDocuments();
        console.log(`Total items in database: ${count}`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();