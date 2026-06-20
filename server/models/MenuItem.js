const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        category: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, trim: true },
        available: { type: Boolean, default: true },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        featured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;