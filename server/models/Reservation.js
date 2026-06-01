const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tableNumber: { type: Number, required: true, min: 1 },
        guests: { type: Number, required: true, min: 1 },
        reservationDate: { type: Date, required: true },
        specialRequest: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
