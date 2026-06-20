import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../../services/teamService';

const TeamMembersPage = () => {
    const { showToast } = useToast();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Server', shift: 'Morning', status: 'Active' });

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        setLoading(true);
        try {
            const members = await getTeamMembers();
            setTeam(members);
        } catch (err) {
            showToast('Failed to load team members.', 'danger');
        }
        setLoading(false);
    };

    const roles = useMemo(() => ['All', ...new Set(team.map(m => m.role))], [team]);
    const statuses = ['All', 'Active', 'Inactive'];

    const filteredMembers = useMemo(() => {
        return team.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 member.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All' || member.role === roleFilter;
            const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [team, searchQuery, roleFilter, statusFilter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await updateTeamMember(editingMember._id || editingMember.id, formData);
                showToast('Team member updated successfully.', 'success');
            } else {
                await addTeamMember(formData);
                showToast('Team member added successfully.', 'success');
            }
            setShowModal(false);
            setEditingMember(null);
            setFormData({ name: '', email: '', phone: '', role: 'Server', shift: 'Morning', status: 'Active' });
            loadTeamMembers();
        } catch (err) {
            showToast('Failed to save team member.', 'danger');
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role,
            shift: member.shift,
            status: member.status,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            try {
                await deleteTeamMember(id);
                showToast('Team member deleted.', 'info');
                loadTeamMembers();
            } catch (err) {
                showToast('Failed to delete team member.', 'danger');
            }
        }
    };

    const handleToggleStatus = async (member) => {
        try {
            const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
            await updateTeamMember(member._id || member.id, { ...member, status: newStatus });
            showToast(`${member.name} status updated to ${newStatus}.`, 'success');
            loadTeamMembers();
        } catch (err) {
            showToast('Failed to update status.', 'danger');
        }
    };

    const openAddModal = () => {
        setEditingMember(null);
        setFormData({ name: '', email: '', phone: '', role: 'Server', shift: 'Morning', status: 'Active' });
        setShowModal(true);
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Team Management</p>
                    <h2 className="fw-bold text-white">Team Members</h2>
                    <p className="text-muted mb-0">Manage your restaurant staff and their roles.</p>
                </div>
                <button className="btn btn-gold btn-lg" onClick={openAddModal}>
                    Add Team Member
                </button>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm bg-black text-white mb-4 p-3">
                <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label text-muted small">Search team members</label>
                        <input
                            type="text"
                            className="form-control form-control-dark"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label text-muted small">Role</label>
                        <select
                            className="form-select form-control-dark"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label text-muted small">Status</label>
                        <select
                            className="form-select form-control-dark"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-2">
                        <label className="form-label text-muted small">Results: {filteredMembers.length}</label>
                        <button
                            className="btn btn-outline-gold w-100"
                            onClick={() => { setSearchQuery(''); setRoleFilter('All'); setStatusFilter('All'); }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Members List */}
            <div className="card border-0 shadow-sm bg-black text-white">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5 text-muted">Loading team members...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-dark table-borderless mb-0">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Shift</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMembers.map((member) => (
                                        <tr key={member._id || member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td>
                                                <div className="fw-semibold">{member.name}</div>
                                            </td>
                                            <td className="text-muted">{member.email}</td>
                                            <td className="text-muted">{member.phone}</td>
                                            <td>
                                                <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="text-muted">{member.shift}</td>
                                            <td>
                                                <span className={`badge ${member.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex gap-1 justify-content-end">
                                                    <button className="btn btn-sm btn-outline-gold" onClick={() => handleEdit(member)} title="Edit">
                                                        ✎
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm ${member.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                        onClick={() => handleToggleStatus(member)}
                                                        title={member.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {member.status === 'Active' ? '☀' : '🌙'}
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(member._id || member.id)} title="Delete">
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No team members found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content bg-black text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" className="form-control form-control-dark" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control form-control-dark" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Phone</label>
                                            <input type="tel" className="form-control form-control-dark" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Role</label>
                                            <select className="form-select form-control-dark" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                                <option>Server</option>
                                                <option>Chef</option>
                                                <option>Host</option>
                                                <option>Manager</option>
                                                <option>Cleaner</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Shift</label>
                                            <select className="form-select form-control-dark" value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})}>
                                                <option>Morning</option>
                                                <option>Afternoon</option>
                                                <option>Night</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Status</label>
                                            <select className="form-select form-control-dark" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-outline-gold" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-gold">{editingMember ? 'Update' : 'Add'} Team Member</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembersPage;