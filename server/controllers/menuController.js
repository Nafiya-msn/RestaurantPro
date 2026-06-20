const MenuItem = require('../models/MenuItem');

const addMenuItem = async (req, res, next) => {
    try {
    const { name, description, category, price, image, available, rating, featured } = req.body;
        const menuItem = await MenuItem.create({ 
            name, 
            description, 
            category, 
            price, 
            image, 
            available,
            rating: rating || 0,
            featured: featured || false
        });
        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        menuItem.name = req.body.name || menuItem.name;
        menuItem.description = req.body.description || menuItem.description;
        menuItem.category = req.body.category || menuItem.category;
        menuItem.price = req.body.price !== undefined ? req.body.price : menuItem.price;
        menuItem.image = req.body.image || menuItem.image;
        menuItem.available = req.body.available !== undefined ? req.body.available : menuItem.available;
        menuItem.rating = req.body.rating !== undefined ? req.body.rating : menuItem.rating;
        menuItem.featured = req.body.featured !== undefined ? req.body.featured : menuItem.featured;

        const updated = await menuItem.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } catch (error) {
        next(error);
    }
};

const getMenu = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.available === 'true') {
            filter.available = true;
        }
        const menu = await MenuItem.find(filter).sort({ name: 1 });
        res.json(menu);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenu,
};