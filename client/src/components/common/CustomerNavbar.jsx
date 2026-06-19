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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/customer/dashboard">
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
                    <span className="navbar-toggler-icon" />
                </button>
                
                <div className="collapse navbar-collapse" id="customerNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/dashboard">
                                Menu
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/orders">
                                My Orders
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customer/profile">
                                Profile
                            </NavLink>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/customer/cart" className="btn btn-outline-light position-relative">
                            Cart
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {user && (
                            <div className="text-white d-flex align-items-center gap-2">
                                <span>Hello, {user.name}</span>
                                <button className="btn btn-sm btn-light" onClick={logout}>
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
