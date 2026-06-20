const TeamMember = require('../models/TeamMember');

const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch team members', error: err.message });
    }
};

const addTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json(member);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add team member', error: err.message });
    }
};

const updateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update team member', error: err.message });
    }
};

const deleteTeamMember = async (req, res) => {
    try {
        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team member deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete team member', error: err.message });
    }
};

module.exports = { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember };