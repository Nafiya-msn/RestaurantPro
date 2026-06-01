const express = require('express');
const { body, param } = require('express-validator');
const { addStaff, updateStaff, getStaff } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

const staffValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('role').isString().trim().notEmpty().withMessage('Role is required'),
    body('attendance').optional().isArray(),
    body('performance').optional().isObject(),
    validateRequest,
];

router.get('/', protect, authorizeRoles('admin', 'staff'), getStaff);
router.post('/', protect, authorizeRoles('admin'), staffValidation, addStaff);
router.put('/:id', protect, authorizeRoles('admin'), [param('id').isMongoId().withMessage('Invalid staff ID'), ...staffValidation], updateStaff);

module.exports = router;
