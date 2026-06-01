const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
    {
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'off'],
            required: true,
        },
        notes: { type: String, trim: true },
    },
    { _id: false }
);

const performanceSchema = mongoose.Schema(
    {
        rating: { type: Number, min: 0, max: 5, default: 0 },
        review: { type: String, trim: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const staffSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: {
            type: String,
            enum: ['admin', 'chef', 'server', 'host', 'bartender', 'manager', 'cleaning', 'staff'],
            default: 'staff',
        },
        attendance: { type: [attendanceSchema], default: [] },
        performance: { type: performanceSchema, default: () => ({}) },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
