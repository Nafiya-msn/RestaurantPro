import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const LoginPage = () => {
    const { handleLogin, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await handleLogin({ email, password, accessCode });
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by auth context and user-visible feedback.
        }
    };

    return (
        <div className="auth-form text-white">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Welcome back</h2>
                <p className="text-muted mb-0">Sign in to access your premium restaurant dashboard.</p>
            </div>
            {error && <Message variant="danger">{error}</Message>}
            <form onSubmit={submitHandler} className="mb-3">
                <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <input
                        type="email"
                        className="form-control form-control-dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label text-muted">Password</label>
                    <input
                        type="password"
                        className="form-control form-control-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label text-muted">Access Code (Optional)</label>
                    <input
                        type="text"
                        className="form-control form-control-dark"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Enter access code for admin privileges"
                    />
                </div>
                <button className="btn btn-gold w-100 py-2" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <p className="text-center text-muted small mb-0">
                No account yet? <Link className="text-gold" to="/auth/register">Create one</Link>
            </p>
            {loading && <Loader />}
        </div>
    );
};

export default LoginPage;
