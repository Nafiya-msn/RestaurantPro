const express = require('express');
const { body, param } = require('express-validator');
const {
    createReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
    getReservations,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

const reservationValidation = [
    body('tableNumber').isInt({ min: 1 }).withMessage('Table number is required and must be a positive integer'),
    body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
    body('reservationDate').isISO8601().withMessage('Reservation date must be a valid date'),
    body('specialRequest').optional().isString().trim(),
    validateRequest,
];

const reservationUpdateValidation = [
    param('id').isMongoId().withMessage('Invalid reservation ID'),
    body('tableNumber').optional().isInt({ min: 1 }),
    body('guests').optional().isInt({ min: 1 }),
    body('reservationDate').optional().isISO8601(),
    body('specialRequest').optional().isString().trim(),
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
    validateRequest,
];

router.get('/', protect, getReservations);
router.post('/', protect, reservationValidation, createReservation);
router.put('/:id', protect, reservationUpdateValidation, updateReservation);
router.put('/:id/cancel', protect, [param('id').isMongoId().withMessage('Invalid reservation ID'), validateRequest], cancelReservation);
router.delete('/:id', protect, [param('id').isMongoId().withMessage('Invalid reservation ID'), validateRequest], deleteReservation);

module.exports = router;
