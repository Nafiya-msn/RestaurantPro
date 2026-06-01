import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const StaffManagementPage = () => {
    const [team] = useState([
        { name: 'Amelia Ross', role: 'Chef', attendance: 'Present', performance: 'Excellent' },
        { name: 'Jason Reed', role: 'Host', attendance: 'Late', performance: 'Strong' },
        { name: 'Nina Clarke', role: 'Server', attendance: 'Present', performance: 'Outstanding' },
    ]);
    const { showToast } = useToast();

    const handleAddMember = () => {
        showToast('Team member creation will be available in the next release.', 'info');
    };

    const handleReviewProfile = (name) => {
        showToast(`Reviewing performance notes for ${name}.`, 'info');
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Staff management</p>
                    <h2 className="fw-bold text-white">Empower your restaurant team</h2>
                    <p className="text-muted mb-0">Track attendance, performance and staffing needs with premium visibility.</p>
                </div>
                <button className="btn btn-gold btn-lg" onClick={handleAddMember}>
                    Add team member
                </button>
            </div>

            <div className="row g-4">
                {team.map((member) => (
                    <div className="col-md-6 col-xl-4" key={member.name}>
                        <div className="card border-0 shadow-sm bg-black text-white h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <h5 className="mb-1">{member.name}</h5>
                                        <p className="text-muted small mb-0">{member.role}</p>
                                    </div>
                                    <span className={`badge ${member.attendance === 'Present' ? 'bg-success' : member.attendance === 'Late' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                        {member.attendance}
                                    </span>
                                </div>
                                <p className="text-muted mb-3">
                                    Performance: <span className="text-white">{member.performance}</span>
                                </p>
                                <button className="btn btn-outline-gold btn-sm" onClick={() => handleReviewProfile(member.name)}>
                                    Review profile
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffManagementPage;
