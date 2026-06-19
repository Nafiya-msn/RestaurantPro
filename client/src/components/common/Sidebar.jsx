import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const role = user?.role || 'staff'; // fallback if somehow not set

    // Define all possible items with their allowed roles
    const allItems = [
        { label: 'Dashboard', to: `/${role}/dashboard`, roles: ['admin', 'staff'] },
        { label: 'Reservations', to: '/reservations', roles: ['admin'] },
        { label: 'Orders', to: '/orders', roles: ['admin', 'staff'] },
        { label: 'Menu', to: '/menu', roles: ['admin', 'staff'] },
        { label: 'Customers', to: '/customers', roles: ['admin'] },
        { label: 'Staff', to: '/staff', roles: ['admin'] },
        { label: 'Profile', to: '/profile', roles: ['admin', 'staff'] },
    ];

    const navItems = allItems.filter(item => item.roles.includes(role));

    return (
        <aside className="sidebar d-flex flex-column text-white bg-black shadow-lg">
            <div className="sidebar-brand p-4 text-center border-bottom border-secondary">
                <span className="brand-icon">R</span>
                <div className="mt-3 fs-5 fw-bold">RestaurantPro</div>
                <div className="text-muted small">Premium management suite</div>
            </div>

            <nav className="nav flex-column p-3 gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-link rounded-3 px-3 py-2 ${isActive ? 'active' : 'text-white'}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
