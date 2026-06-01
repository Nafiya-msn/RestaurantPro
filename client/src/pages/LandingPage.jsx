import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page min-vh-100 d-flex align-items-center justify-content-center text-white" style={{ backgroundImage: 'linear-gradient(135deg, #0f0f0f 0%, #1f1d18 45%, #2e2920 100%)' }}>
            <div className="container py-5">
                <div className="row align-items-center gap-4">
                    <div className="col-lg-6">
                        <div className="p-5 rounded-4 shadow-lg bg-glass border border-secondary">
                            <span className="badge bg-gold text-dark mb-3">Premium Restaurant Control</span>
                            <h1 className="display-5 fw-bold mb-4">RestaurantPro elevates every service moment.</h1>
                            <p className="lead text-muted mb-4">
                                Streamline reservations, orders, staff, and guest experience with a luxury dashboard built for modern restaurants.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link className="btn btn-gold btn-lg" to="/auth/register">
                                    Start Free Trial
                                </Link>
                                <Link className="btn btn-outline-gold btn-lg" to="/auth/login">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="features-card p-4 rounded-4 shadow-lg bg-black border border-secondary">
                            <h5 className="text-gold mb-4">What you get</h5>
                            <ul className="list-unstyled text-muted mb-0">
                                <li className="mb-3">• Elegant dark theme with premium gold accents</li>
                                <li className="mb-3">• Reservation and order management in one place</li>
                                <li className="mb-3">• Real-time guest and kitchen workflows</li>
                                <li className="mb-3">• Responsive layout for tablets and phones</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
