import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Reservations', to: '/reservations' },
        { label: 'Orders', to: '/orders' },
        { label: 'Menu', to: '/menu' },
        { label: 'Customers', to: '/customers' },
        { label: 'Staff', to: '/staff' },
        { label: 'Profile', to: '/profile' },
    ];

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
