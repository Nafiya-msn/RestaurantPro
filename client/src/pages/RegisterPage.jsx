import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const RegisterPage = () => {
    const { handleRegister, loading, error } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await handleRegister(formData);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by auth context and user-visible feedback.
        }
    };

    const updateField = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    return (
        <div className="auth-form text-white">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Create your account</h2>
                <p className="text-muted mb-0">Join RestaurantPro and manage your restaurant with style.</p>
            </div>
            {error && <Message variant="danger">{error}</Message>}
            <form onSubmit={submitHandler} className="mb-3">
                <div className="mb-3">
                    <label className="form-label text-muted">Full name</label>
                    <input className="form-control form-control-dark" value={formData.name} onChange={updateField('name')} required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <input type="email" className="form-control form-control-dark" value={formData.email} onChange={updateField('email')} required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted">Password</label>
                    <input type="password" className="form-control form-control-dark" value={formData.password} onChange={updateField('password')} required />
                </div>
                <div className="mb-4">
                    <label className="form-label text-muted">Role</label>
                    <select className="form-select form-select-dark" value={formData.role} onChange={updateField('role')}>
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button className="btn btn-gold w-100 py-2" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
            <p className="text-center text-muted small mb-0">
                Already signed up? <Link className="text-gold" to="/auth/login">Login</Link>
            </p>
            {loading && <Loader />}
        </div>
    );
};

export default RegisterPage;
