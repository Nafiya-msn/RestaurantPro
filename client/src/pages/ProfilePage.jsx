import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
    const { user, handleUpdateProfile } = useAuth();
    const { orders, reservations } = useApp();
    const [profile, setProfile] = useState({ name: '', email: '', role: '' });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        setProfile({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'Manager',
        });
    }, [user]);

    const handleSave = async (event) => {
        event.preventDefault();
        setLoading(true);
        await handleUpdateProfile(profile);
        setSaved(true);
        setLoading(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Profile</p>
                    <h2 className="fw-bold text-white">Your account and activity</h2>
                    <p className="text-muted mb-0">Update your personal details and review current restaurant activity.</p>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm bg-black text-white p-4">
                        <h5 className="mb-4">Account details</h5>
                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    className="form-control form-control-dark"
                                    value={profile.name}
                                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-dark"
                                    value={profile.email}
                                    onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <input
                                    className="form-control form-control-dark"
                                    value={profile.role}
                                    onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))}
                                />
                            </div>
                            <button className="btn btn-gold" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save changes'}
                            </button>
                            {saved && <div className="text-success mt-3">Profile saved successfully.</div>}
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm bg-black text-white p-4 h-100">
                                <h5 className="mb-4">Activity summary</h5>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span className="text-muted">Total orders</span>
                                    <strong>{orders.length}</strong>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span className="text-muted">Active reservations</span>
                                    <strong>{reservations.filter((reservation) => reservation.status !== 'cancelled').length}</strong>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-muted">Saved settings</span>
                                    <strong>Secure</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card border-0 shadow-sm bg-black text-white p-4 h-100">
                                <h5 className="mb-4">Support note</h5>
                                <p className="text-muted small mb-0">
                                    Update your contact details now. For full account management and permissions, integrate backend profile APIs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
