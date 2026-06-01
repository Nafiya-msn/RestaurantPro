const Reservation = require('../models/Reservation');

const createReservation = async (req, res, next) => {
    try {
        const { tableNumber, guests, reservationDate, specialRequest } = req.body;

        const reservation = await Reservation.create({
            customer: req.user._id,
            tableNumber,
            guests,
            reservationDate,
            specialRequest,
        });

        res.status(201).json(reservation);
    } catch (error) {
        next(error);
    }
};

const updateReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const isOwner = reservation.customer.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update reservation' });
        }

        reservation.tableNumber = req.body.tableNumber || reservation.tableNumber;
        reservation.guests = req.body.guests || reservation.guests;
        reservation.reservationDate = req.body.reservationDate || reservation.reservationDate;
        reservation.specialRequest = req.body.specialRequest || reservation.specialRequest;
        reservation.status = req.body.status || reservation.status;

        const updated = await reservation.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const cancelReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const isOwner = reservation.customer.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to cancel reservation' });
        }

        reservation.status = 'cancelled';
        await reservation.save();
        res.json({ message: 'Reservation cancelled', reservation });
    } catch (error) {
        next(error);
    }
};

const getReservations = async (req, res, next) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { customer: req.user._id };
        const reservations = await Reservation.find(filter).populate('customer', 'name email role').sort({ reservationDate: 1 });
        res.json(reservations);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReservation,
    updateReservation,
    cancelReservation,
    getReservations,
};
