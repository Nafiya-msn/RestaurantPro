const Staff = require('../models/Staff');

const addStaff = async (req, res, next) => {
    try {
        const { name, role, attendance, performance } = req.body;
        const staff = await Staff.create({ name, role, attendance, performance });
        res.status(201).json(staff);
    } catch (error) {
        next(error);
    }
};

const updateStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        staff.name = req.body.name || staff.name;
        staff.role = req.body.role || staff.role;
        staff.attendance = req.body.attendance || staff.attendance;
        staff.performance = req.body.performance || staff.performance;

        const updated = await staff.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const getStaff = async (req, res, next) => {
    try {
        const staff = await Staff.find().sort({ name: 1 });
        res.json(staff);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addStaff,
    updateStaff,
    getStaff,
};
