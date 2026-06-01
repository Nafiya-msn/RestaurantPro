import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const CustomerManagementPage = () => {
    const [customers] = useState([
        { name: 'Sophia Lee', email: 'sophia@example.com', visits: 12, premium: true },
        { name: 'Ethan Cole', email: 'ethan@example.com', visits: 7, premium: false },
        { name: 'Chloe Kim', email: 'chloe@example.com', visits: 5, premium: true },
    ]);
    const { showToast } = useToast();

    const handleInvite = () => {
        showToast('Invitation sent to selected guest list.', 'success');
    };

    const handleViewProfile = (name) => {
        showToast(`Opening customer profile for ${name}.`, 'info');
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Customer management</p>
                    <h2 className="fw-bold text-white">Build lasting guest relationships</h2>
                    <p className="text-muted mb-0">Monitor loyalty, preferences and booking patterns for your top clientele.</p>
                </div>
                <button className="btn btn-outline-gold btn-lg" onClick={handleInvite}>
                    Invite guests
                </button>
            </div>

            <div className="row g-4">
                {customers.map((customer) => (
                    <div className="col-md-6 col-xl-4" key={customer.email}>
                        <div className="card border-0 shadow-sm bg-black text-white h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <h5 className="mb-1">{customer.name}</h5>
                                        <p className="text-muted small mb-0">{customer.email}</p>
                                    </div>
                                    <span className={`badge ${customer.premium ? 'bg-gold text-dark' : 'bg-secondary'}`}>
                                        {customer.premium ? 'VIP' : 'Guest'}
                                    </span>
                                </div>
                                <p className="text-muted mb-3">Visits: {customer.visits}</p>
                                <button className="btn btn-outline-gold btn-sm" onClick={() => handleViewProfile(customer.name)}>
                                    View profile
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerManagementPage;
