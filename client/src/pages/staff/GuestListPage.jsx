import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getReservations, updateReservation, deleteReservation } from '../../services/reservationService';

const GuestListPage = () => {
    const { showToast } = useToast();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingGuest, setEditingGuest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ customerName: '', phone: '', email: '', guests: 2, time: '', notes: '', status: 'pending' });

    useEffect(() => {
        loadGuests();
    }, []);

    const loadGuests = async () => {
        setLoading(true);
        try {
            const data = await getReservations();
            setGuests(data || []);
        } catch (err) {
            showToast('Failed to load guest list.', 'danger');
        }
        setLoading(false);
    };

    const statuses = ['All', 'pending', 'confirmed', 'arrived', 'cancelled'];

    const filteredGuests = useMemo(() => {
        return guests.filter(guest => {
            const matchesSearch = (guest.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (guest.phone || '').includes(searchQuery) ||
                                 (guest.email || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || guest.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [guests, searchQuery, statusFilter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGuest) {
                await updateReservation(editingGuest._id || editingGuest.id, formData);
                showToast('Guest updated successfully.', 'success');
            }
            setShowModal(false);
            setEditingGuest(null);
            setFormData({ customerName: '', phone: '', email: '', guests: 2, time: '', notes: '', status: 'pending' });
            loadGuests();
        } catch (err) {
            showToast('Failed to save guest.', 'danger');
        }
    };

    const handleEdit = (guest) => {
        setEditingGuest(guest);
        setFormData({
            customerName: guest.customerName || guest.name || '',
            phone: guest.phone || '',
            email: guest.email || '',
            guests: guest.guests || 2,
            time: guest.time || '',
            notes: guest.notes || '',
            status: guest.status || 'pending',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this guest?')) {
            try {
                await deleteReservation(id);
                showToast('Guest deleted.', 'info');
                loadGuests();
            } catch (err) {
                showToast('Failed to delete guest.', 'danger');
            }
        }
    };

    const handleStatusChange = async (guest, newStatus) => {
        try {
            await updateReservation(guest._id || guest.id, { ...guest, status: newStatus });
            showToast(`Guest status updated to ${newStatus}.`, 'success');
            loadGuests();
        } catch (err) {
            showToast('Failed to update status.', 'danger');
        }
    };

    const openAddModal = () => {
        setEditingGuest(null);
        setFormData({ customerName: '', phone: '', email: '', guests: 2, time: '', notes: '', status: 'pending' });
        setShowModal(true);
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Guest Management</p>
                    <h2 className="fw-bold text-white">Guest List</h2>
                    <p className="text-muted mb-0">Manage guest reservations and track arrivals.</p>
                </div>
                <button className="btn btn-gold btn-lg" onClick={openAddModal}>
                    Add Guest
                </button>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm bg-black text-white mb-4 p-3">
                <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label text-muted small">Search guests</label>
                        <input
                            type="text"
                            className="form-control form-control-dark"
                            placeholder="Search by name, phone, or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label text-muted small">Status</label>
                        <select
                            className="form-select form-control-dark"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-sm-6 col-md-2">
                        <label className="form-label text-muted small">Results: {filteredGuests.length}</label>
                        <button
                            className="btn btn-outline-gold w-100"
                            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Guest List Table */}
            <div className="card border-0 shadow-sm bg-black text-white">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5 text-muted">Loading guest list...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-dark table-borderless mb-0">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th>Guest Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Guests</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGuests.map((guest) => {
                                        const guestId = guest._id || guest.id;
                                        return (
                                            <tr key={guestId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td>
                                                    <div className="fw-semibold">{guest.customerName || guest.name}</div>
                                                </td>
                                                <td className="text-muted">{guest.phone || '-'}</td>
                                                <td className="text-muted">{guest.email || '-'}</td>
                                                <td className="text-muted">{guest.guests || 0}</td>
                                                <td className="text-muted">{guest.reservationDate ? new Date(guest.reservationDate).toLocaleDateString() : '-'}</td>
                                                <td className="text-muted">{guest.time || '-'}</td>
                                                <td>
                                                    <span className={`badge ${guest.status === 'confirmed' ? 'bg-success' : guest.status === 'pending' ? 'bg-warning text-dark' : guest.status === 'arrived' ? 'bg-info' : 'bg-secondary'}`}>
                                                        {guest.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex gap-1 justify-content-end">
                                                        <button className="btn btn-sm btn-outline-gold" onClick={() => handleEdit(guest)} title="Edit">
                                                            ✎
                                                        </button>
                                                        {guest.status === 'pending' && (
                                                            <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(guest, 'confirmed')} title="Confirm">
                                                                ✓
                                                            </button>
                                                        )}
                                                        {guest.status === 'confirmed' && (
                                                            <button className="btn btn-sm btn-info" onClick={() => handleStatusChange(guest, 'arrived')} title="Mark Arrived">
                                                                ☀
                                                            </button>
                                                        )}
                                                        {(guest.status === 'pending' || guest.status === 'confirmed') && (
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(guest, 'cancelled')} title="Cancel">
                                                                ✕
                                                            </button>
                                                        )}
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(guestId)} title="Delete">
                                                            🗑
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredGuests.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5 text-muted">
                                                No guests found matching your filters.
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
                <div className="modal-backdrop d-flex align-items-center justify-content-center">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-black text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">{editingGuest ? 'Edit Guest' : 'Add Guest'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Guest Name</label>
                                            <input type="text" className="form-control form-control-dark" required value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Phone Number</label>
                                            <input type="tel" className="form-control form-control-dark" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control form-control-dark" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Number of Guests</label>
                                            <input type="number" className="form-control form-control-dark" min="1" required value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})} />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Reservation Time</label>
                                            <input type="time" className="form-control form-control-dark" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Notes (optional)</label>
                                            <textarea className="form-control form-control-dark" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Status</label>
                                            <select className="form-select form-control-dark" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="arrived">Arrived</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-outline-gold" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-gold">{editingGuest ? 'Update' : 'Save'} Guest</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestListPage;