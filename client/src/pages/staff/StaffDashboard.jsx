import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const StaffDashboard = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { orders, reservations, teamMembers, cycleOrderStatus, formatCurrency, createReservation, updateReservationStatus, cancelReservation, addTeamMember } = useApp();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [newReservation, setNewReservation] = useState({ name: '', phone: '', email: '', guests: 2, date: '', time: '', notes: '' });
    const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: 'Server', shift: 'Morning', status: 'Active' });

    const today = new Date().toDateString();
    const todayOrders = useMemo(() => orders.filter((o) => new Date(o.createdAt || o._id).toDateString() === today), [orders]);
    const activeOrders = useMemo(() => orders.filter((o) => (o.orderStatus || o.status) !== 'completed' && (o.orderStatus || o.status) !== 'cancelled'), [orders]);
    const todayRevenue = useMemo(() => todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [todayOrders]);
    const todayReservations = useMemo(() => reservations.filter((r) => new Date(r.createdAt || r._id).toDateString() === today), [reservations]);

    const notifications = useMemo(() => {
        const notifs = [];
        orders.forEach(order => {
            const orderId = order._id || order.id;
            const orderStatus = order.orderStatus || order.status;
            if (['pending', 'confirmed'].includes(orderStatus)) {
                notifs.push({ id: `order-${orderId}`, type: 'order', message: `New order #${String(orderId).slice(-6)} - ${orderStatus}`, time: order.createdAt });
            }
        });
        reservations.forEach(res => {
            const resId = res._id || res.id;
            if (res.status === 'pending') {
                notifs.push({ id: `res-${resId}`, type: 'reservation', message: `New reservation from ${res.customerName || res.name}`, time: res.createdAt });
            } else if (res.status === 'cancelled') {
                notifs.push({ id: `res-cancel-${resId}`, type: 'cancelled', message: `Reservation cancelled - ${res.customerName || res.name}`, time: res.createdAt });
            }
        });
        return notifs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    }, [orders, reservations]);

    const summary = [
        { title: "Today's Reservations", value: String(todayReservations.length), subtitle: 'Reservations today', icon: '📅' },
        { title: 'Active Orders', value: String(activeOrders.length), subtitle: 'Currently being prepared', icon: '🔥' },
        { title: 'Team Members', value: String(teamMembers.length), subtitle: 'Total staff', icon: '👥' },
        { title: "Revenue Today", value: formatCurrency(todayRevenue), subtitle: 'Today\'s earnings', icon: '💰' },
    ];

    const handleInviteGuest = async (e) => {
        e.preventDefault();
        await createReservation(newReservation);
        setShowInviteModal(false);
        setNewReservation({ name: '', phone: '', guests: 2, date: '', time: '', notes: '' });
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        await addTeamMember(newMember);
        setShowAddMemberModal(false);
        setNewMember({ name: '', email: '', phone: '', role: 'Server', shift: 'Morning', status: 'Active' });
    };

    const handleConfirmReservation = async (id) => {
        await updateReservationStatus(id, 'confirmed');
    };

    const handleCancelReservation = async (id) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            await cancelReservation(id);
        }
    };

    const handleMarkArrived = async (id) => {
        await updateReservationStatus(id, 'arrived');
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Staff Dashboard</p>
                    <h2 className="fw-bold text-white">Active Service</h2>
                    <p className="text-muted mb-0">Manage incoming orders, reservations, and team members.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-gold" onClick={() => setShowInviteModal(true)}>
                        Invite Guest
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => setShowAddMemberModal(true)}>
                        Add Team Member
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => navigate('/staff/orders')}>
                        All Orders
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => navigate('/staff/reservations')}>
                        Reservations
                    </button>
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button className="btn btn-outline-gold" onClick={() => setShowNotifications(!showNotifications)}>
                            🔔 {notifications.length > 0 && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>{notifications.length}</span>}
                        </button>
                        {showNotifications && (
                            <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%', minWidth: '300px', maxHeight: '400px', overflowY: 'auto', background: '#101010', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', marginTop: '0.5rem', zIndex: 1000 }}>
                                <div className="p-3 border-bottom border-secondary">
                                    <h6 className="mb-0 text-white">Notifications</h6>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="p-3 text-muted small">No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className="p-3 border-bottom border-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div className="small text-white">{notif.message}</div>
                                            <div className="small text-muted">{new Date(notif.time).toLocaleTimeString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {summary.map((item) => (
                    <div className="col-12 col-md-6 col-xl-3" key={item.title}>
                        <div className="card border-0 shadow-sm bg-black text-white h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                                    <div>
                                        <h5 className="mb-0 fw-bold">{item.value}</h5>
                                        <p className="text-muted small mb-0">{item.title}</p>
                                        <p className="text-muted small mb-0">{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm bg-black text-white">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Active Orders</h5>
                                <span className="badge bg-gold text-dark">{activeOrders.length} Active</span>
                            </div>
                            <div className="list-group list-group-flush">
                                {activeOrders.slice(0, 5).map((order) => {
                                    const orderStatus = order.orderStatus || order.status;
                                    const orderId = order._id || order.id;
                                    const customerName = order.customer?.name || order.customer || 'Unknown';
                                    const orderType = order.orderType || order.type;
                                    return (
                                        <div key={orderId} className="list-group-item bg-transparent border-bottom border-secondary text-white py-3">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="fw-semibold">{String(orderId).slice(-6)}</div>
                                                    <div className="small text-muted">{customerName} · {orderType}</div>
                                                </div>
                                                <button className={`btn btn-sm ${orderStatus === 'ready' ? 'btn-success' : (orderStatus === 'preparing' || orderStatus === 'received') ? 'btn-warning text-dark' : 'btn-outline-light'}`} onClick={() => cycleOrderStatus(orderId)}>
                                                    {orderStatus.toUpperCase()} ➔
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {activeOrders.length === 0 && (
                                    <div className="py-4 text-center text-muted">No active orders right now.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm bg-black text-white">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Recent Reservations</h5>
                                <span className="badge bg-gold text-dark">{reservations.length} Total</span>
                            </div>
                            <div className="list-group list-group-flush">
                                {reservations.slice(0, 5).map((reservation) => {
                                    const resId = reservation._id || reservation.id;
                                    return (
                                        <div key={resId} className="list-group-item bg-transparent border-bottom border-secondary text-white py-3">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="fw-semibold">{reservation.customerName || reservation.name}</div>
                                                    <div className="small text-muted">{reservation.guests} guests · {reservation.time}</div>
                                                    <span className={`badge mt-1 ${reservation.status === 'confirmed' ? 'bg-success' : reservation.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                        {reservation.status}
                                                    </span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    {reservation.status === 'pending' && (
                                                        <button className="btn btn-sm btn-success" onClick={() => handleConfirmReservation(resId)}>Confirm</button>
                                                    )}
                                                    {reservation.status === 'confirmed' && (
                                                        <button className="btn btn-sm btn-info" onClick={() => handleMarkArrived(resId)}>Arrived</button>
                                                    )}
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelReservation(resId)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {reservations.length === 0 && (
                                    <div className="py-4 text-center text-muted">No reservations yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Guest">
                <form onSubmit={handleInviteGuest}>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">Guest Name</label>
                            <input type="text" className="form-control form-control-dark" required value={newReservation.name} onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" className="form-control form-control-dark" required value={newReservation.phone} onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control form-control-dark" required value={newReservation.email} onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Number of Guests</label>
                            <input type="number" className="form-control form-control-dark" min="1" required value={newReservation.guests} onChange={(e) => setNewReservation({ ...newReservation, guests: parseInt(e.target.value) || 1 })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Reservation Date</label>
                            <input type="date" className="form-control form-control-dark" required value={newReservation.date} onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Reservation Time</label>
                            <input type="time" className="form-control form-control-dark" required value={newReservation.time} onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Notes (optional)</label>
                            <textarea className="form-control form-control-dark" rows="2" value={newReservation.notes} onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}></textarea>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-gold w-100">Create Reservation</button>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal show={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title="Add Team Member">
                <form onSubmit={handleAddMember}>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control form-control-dark" required value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control form-control-dark" required value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-control form-control-dark" required value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Role</label>
                            <select className="form-select form-control-dark" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                                <option>Server</option>
                                <option>Chef</option>
                                <option>Host</option>
                                <option>Manager</option>
                                <option>Cleaner</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label">Shift</label>
                            <select className="form-select form-control-dark" value={newMember.shift} onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}>
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Night</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-gold w-100">Add Team Member</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StaffDashboard;