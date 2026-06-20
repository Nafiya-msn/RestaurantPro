import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const CustomerNavbar = () => {
    const { user, handleLogout } = useAuth();
    const { cartItems } = useApp();
    const navigate = useNavigate();

    const logout = () => {
        handleLogout();
        navigate('/auth/login');
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: 'linear-gradient(180deg, rgba(15, 15, 15, 0.98), rgba(13, 13, 13, 0.98))', borderBottom: '1px solid rgba(212, 175, 55, 0.18)' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold" style={{ color: '#d4af37' }} to="/customer/dashboard">
                    RestaurantPro
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#customerNav"
                    aria-controls="customerNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }} />
                </button>
                
                <div className="collapse navbar-collapse" id="customerNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/dashboard" style={({ isActive }) => ({ color: isActive ? '#d4af37' : '#d8d4ce' })}>
                                Browse Menu
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/orders" style={({ isActive }) => ({ color: isActive ? '#d4af37' : '#d8d4ce' })}>
                                My Orders
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/tracking" style={({ isActive }) => ({ color: isActive ? '#d4af37' : '#d8d4ce' })}>
                                Track Order
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/profile" style={({ isActive }) => ({ color: isActive ? '#d4af37' : '#d8d4ce' })}>
                                Profile
                            </NavLink>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/customer/cart" className="btn position-relative" style={{ color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.85)' }}>
                            Cart
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#d4af37', color: '#111' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {user && (
                            <div className="d-flex align-items-center gap-2" style={{ color: '#f8f7ee' }}>
                                <span>Hello, {user.name}</span>
                                <button className="btn btn-sm" style={{ background: '#d4af37', color: '#111', border: 'none' }} onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavbar;