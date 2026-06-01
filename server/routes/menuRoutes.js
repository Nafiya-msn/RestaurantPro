const express = require('express');
const { body, param, query } = require('express-validator');
const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenu,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

const menuItemValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('description').optional().isString().trim(),
    body('category').optional().isString().trim(),
    body('image').optional().isString().trim(),
    body('availability').optional().isBoolean(),
    validateRequest,
];

router.get('/', [query('category').optional().isString().trim(), validateRequest], getMenu);
router.post('/', protect, authorizeRoles('admin', 'staff'), menuItemValidation, addMenuItem);
router.put('/:id', protect, authorizeRoles('admin', 'staff'), [param('id').isMongoId().withMessage('Invalid menu item ID'), ...menuItemValidation], updateMenuItem);
router.delete('/:id', protect, authorizeRoles('admin', 'staff'), [param('id').isMongoId().withMessage('Invalid menu item ID'), validateRequest], deleteMenuItem);

module.exports = router;
