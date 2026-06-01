const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: { type: String },
        available: { type: Boolean, default: true },
    },
    { _id: false }
);

const restaurantSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        cuisine: { type: String },
        description: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        menu: [menuItemSchema],
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
