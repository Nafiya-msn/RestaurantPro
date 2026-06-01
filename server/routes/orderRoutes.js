const express = require('express');
const { body, param } = require('express-validator');
const {
    createOrder,
    updateOrderStatus,
    trackOrder,
    getCustomerOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

const orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.menuItem').isMongoId().withMessage('Menu item ID must be valid'),
    body('items.*.name').isString().trim().notEmpty().withMessage('Item name is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Order type must be dine-in, takeaway, or delivery'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative'),
    body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
    validateRequest,
];

const orderStatusValidation = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('orderStatus').isIn(['received', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('Invalid order status'),
    body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
    validateRequest,
];

router.post('/', protect, orderValidation, createOrder);
router.put('/:id/status', protect, authorizeRoles('admin', 'staff'), orderStatusValidation, updateOrderStatus);
router.get('/:id', protect, [param('id').isMongoId().withMessage('Invalid order ID'), validateRequest], trackOrder);
router.get('/customer/:customerId', protect, [param('customerId').isMongoId().withMessage('Invalid customer ID'), validateRequest], getCustomerOrders);

module.exports = router;
