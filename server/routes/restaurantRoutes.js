const express = require('express');
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getRestaurants).post(protect, createRestaurant);
router.route('/:id').get(protect, getRestaurantById).put(protect, updateRestaurant).delete(protect, deleteRestaurant);

module.exports = router;
