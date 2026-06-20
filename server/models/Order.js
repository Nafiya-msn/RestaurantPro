const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
    {
        menuItem: { type: mongoose.Schema.Types.Mixed, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        notes: { type: String, trim: true },
    },
    { _id: false }
);

const orderSchema = mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [orderItemSchema], required: true, validate: [(val) => val.length > 0, 'Order must have at least one item'] },
        orderType: {
            type: String,
            enum: ['dine-in', 'takeaway', 'delivery'],
            required: true,
        },
        totalAmount: { type: Number, required: true, min: 0 },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
