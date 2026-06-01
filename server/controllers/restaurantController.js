const Restaurant = require('../models/Restaurant');

const getRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json(restaurants);
};

const getRestaurantById = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant && restaurant.owner.equals(req.user._id)) {
        res.json(restaurant);
    } else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
};

const createRestaurant = async (req, res) => {
    const { name, address, phone, email, cuisine, description, menu } = req.body;
    const restaurant = new Restaurant({
        name,
        address,
        phone,
        email,
        cuisine,
        description,
        owner: req.user._id,
        menu,
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
};

const updateRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant && restaurant.owner.equals(req.user._id)) {
        restaurant.name = req.body.name || restaurant.name;
        restaurant.address = req.body.address || restaurant.address;
        restaurant.phone = req.body.phone || restaurant.phone;
        restaurant.email = req.body.email || restaurant.email;
        restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
        restaurant.description = req.body.description || restaurant.description;
        restaurant.menu = req.body.menu || restaurant.menu;
        restaurant.active = req.body.active ?? restaurant.active;

        const updatedRestaurant = await restaurant.save();
        res.json(updatedRestaurant);
    } else {
        res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }
};

const deleteRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant && restaurant.owner.equals(req.user._id)) {
        await restaurant.remove();
        res.json({ message: 'Restaurant removed' });
    } else {
        res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};
