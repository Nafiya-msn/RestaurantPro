const Reservation = require('../models/Reservation');

const createReservation = async (req, res, next) => {
    try {
        const { customerName, tableNumber, guests, reservationDate, specialRequest, notes, time } = req.body;

        const reservation = await Reservation.create({
            customer: req.user._id,
            customerName: customerName || req.user.name,
            tableNumber: tableNumber || Math.floor(Math.random() * 20) + 1,
            guests: guests || 2,
            reservationDate: reservationDate ? new Date(reservationDate) : new Date(),
            specialRequest: specialRequest || notes || '',
            time: time || '',
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

        if (req.body.tableNumber) reservation.tableNumber = req.body.tableNumber;
        if (req.body.guests) reservation.guests = req.body.guests;
        if (req.body.reservationDate) reservation.reservationDate = new Date(req.body.reservationDate);
        if (req.body.specialRequest !== undefined) reservation.specialRequest = req.body.specialRequest;
        if (req.body.notes !== undefined) reservation.specialRequest = req.body.notes;
        if (req.body.status) reservation.status = req.body.status;
        if (req.body.time) reservation.time = req.body.time;
        if (req.body.customerName) reservation.customerName = req.body.customerName;

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

const deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const isOwner = reservation.customer.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete reservation' });
        }

        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reservation deleted successfully' });
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
    deleteReservation,
    getReservations,
};
