const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
    try {
        const { items, orderType, totalAmount, paymentStatus } = req.body;

        const order = await Order.create({
            customer: req.user._id,
            items,
            orderType,
            totalAmount,
            paymentStatus,
        });

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = req.body.orderStatus || order.orderStatus;
        if (req.body.paymentStatus) {
            order.paymentStatus = req.body.paymentStatus;
        }

        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const trackOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.customer._id.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

const getCustomerOrders = async (req, res, next) => {
    try {
        const customerId = req.params.customerId;
        if (!req.user._id.equals(customerId) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to view customer orders' });
        }

        const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    trackOrder,
    getCustomerOrders,
};
