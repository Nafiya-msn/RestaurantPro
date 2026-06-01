const express = require('express');
const { body, query } = require('express-validator');
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

const reviewValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().trim(),
    validateRequest,
];

router.post('/', protect, reviewValidation, addReview);
router.get('/', [query('customerId').optional().isMongoId().withMessage('Invalid customer ID'), validateRequest], getReviews);

module.exports = router;
