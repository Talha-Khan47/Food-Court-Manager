const MenuItem = require('../models/MenuItem');

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const category = req.query.category;
        const filter = category ? { category } : {};
        
        const menuItems = await MenuItem.find(filter);
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, image, category, isAvailable } = req.body;

        const menuItem = new MenuItem({
            name,
            description,
            price,
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Default image
            category,
            isAvailable
        });

        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMenuItems,
    createMenuItem
};
