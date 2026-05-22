const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const menuItems = [
    {
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheddar, lettuce, tomato, and our special sauce.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        category: "Burgers",
        isAvailable: true
    },
    {
        name: "Spicy Chicken Sandwich",
        description: "Crispy fried chicken breast with spicy mayo, pickles, and slaw.",
        price: 9.49,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80",
        category: "Burgers",
        isAvailable: true
    },
    {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, tomatoes, and basil on a thin crust.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
        category: "Pizza",
        isAvailable: true
    },
    {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing.",
        price: 7.50,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
        category: "Salads",
        isAvailable: true
    },
    {
        name: "Iced Latte",
        description: "Chilled espresso with milk and a hint of vanilla.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1461023058943-0708e522964b?auto=format&fit=crop&w=800&q=80",
        category: "Beverages",
        isAvailable: true
    },
    {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
        category: "Desserts",
        isAvailable: false
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_court');
        console.log('MongoDB Connected.');

        await MenuItem.deleteMany(); // Clear existing menu items
        console.log('Cleared existing menu items.');

        await MenuItem.insertMany(menuItems);
        console.log('Menu items seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
