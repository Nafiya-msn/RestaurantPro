const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        role: { type: String, required: true, enum: ['Server', 'Chef', 'Host', 'Manager', 'Cleaner'], default: 'Server' },
        shift: { type: String, required: true, enum: ['Morning', 'Afternoon', 'Night'], default: 'Morning' },
        joinDate: { type: Date, default: Date.now },
        status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    },
    { timestamps: true }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = TeamMember;