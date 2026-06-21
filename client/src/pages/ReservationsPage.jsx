import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const ReservationsPage = () => {
    const { reservations, createReservation, updateReservationStatus, cancelReservation } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [reservationForm, setReservationForm] = useState({
        name: '',
        time: '18:30',
        guests: 2,
        notes: '',
    });

    const handleSave = async (event) => {
        event.preventDefault();
        if (!reservationForm.name.trim()) return;
        await createReservation(reservationForm);
        setShowModal(false);
        setReservationForm({ name: '', time: '18:30', guests: 2, notes: '' });
    };

    const buildAction = (reservation) => {
        const reservationId = reservation._id || reservation.id;
        if (reservation.status === 'pending') {
            return (
                <button
                    className="btn btn-sm btn-outline-gold me-2"
                    onClick={() => updateReservationStatus(reservationId, 'confirmed')}
                >
                    Confirm
                </button>
            );
        }

        if (reservation.status === 'confirmed') {
            return (
                <button
                    className="btn btn-sm btn-outline-gold me-2"
                    onClick={() => updateReservationStatus(reservationId, 'completed')}
                >
                    Complete
                </button>
            );
        }

        return null;
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Reservations</p>
                    <h2 className="fw-bold text-white">Manage upcoming guest bookings</h2>
                    <p className="text-muted mb-0">Keep tables flowing with seamless reservation control and premium service timing.</p>
                </div>

                <button className="btn btn-gold btn-lg" onClick={() => setShowModal(true)}>
                    Add reservation
                </button>
            </div>

            <div className="card border-0 shadow-sm bg-black text-white">
                <div className="card-body p-0 overflow-auto">
                    <table className="table table-dark table-borderless mb-0">
                        <thead>
                            <tr>
                                <th>Guest</th>
                                <th>Time</th>
                                <th>Guests</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
        {reservations.map((reservation) => (
                                <tr key={reservation._id || reservation.id}>
                                    <td>{reservation.customerName || reservation.customer?.name || 'Guest'}</td>
                                    <td>{reservation.time || '-'}</td>
                                    <td>{reservation.guests}</td>
                                    <td>
                                        <span className={`badge ${reservation.status === 'confirmed' ? 'bg-success' : reservation.status === 'pending' ? 'bg-warning text-dark' : reservation.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        {buildAction(reservation)}
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => cancelReservation(reservation._id || reservation.id)}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                title="New reservation"
                show={showModal}
                onClose={() => setShowModal(false)}
                footer={
                    <button className="btn btn-gold" onClick={handleSave}>
                        Save reservation
                    </button>
                }
            >
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label className="form-label text-muted">Guest name</label>
                        <input
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Enter guest name"
                            value={reservationForm.name}
                            onChange={(event) => setReservationForm((current) => ({ ...current, name: event.target.value }))}
                        />
                    </div>
                    <div className="row g-3">
                        <div className="col-6">
                            <label className="form-label text-muted">Time</label>
                            <input
                                type="time"
                                className="form-control bg-dark text-white border-secondary"
                                value={reservationForm.time}
                                onChange={(event) => setReservationForm((current) => ({ ...current, time: event.target.value }))}
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label text-muted">Guests</label>
                            <input
                                type="number"
                                className="form-control bg-dark text-white border-secondary"
                                min="1"
                                value={reservationForm.guests}
                                onChange={(event) => setReservationForm((current) => ({ ...current, guests: event.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label className="form-label text-muted">Notes</label>
                        <textarea
                            className="form-control bg-dark text-white border-secondary"
                            rows="3"
                            placeholder="Special requests"
                            value={reservationForm.notes}
                            onChange={(event) => setReservationForm((current) => ({ ...current, notes: event.target.value }))}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ReservationsPage;
