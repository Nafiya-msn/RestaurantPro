import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const HeaderNavbar = () => {
    const { user, handleLogout } = useAuth();
    const { searchQuery, setSearchQuery } = useApp();
    const [searchOpen, setSearchOpen] = useState(false);

    const toggleSearch = () => setSearchOpen((current) => !current);

    return (
        <header className="topbar d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between px-4 py-3 border-bottom border-secondary bg-dark text-white">
            <div className="pe-0 pe-md-3 mb-3 mb-md-0">
                <h1 className="h5 mb-0">Welcome back{user ? `, ${user.name}` : ''}</h1>
                <p className="text-muted small mb-0">Manage your restaurant with elegance and speed.</p>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 w-100 w-md-auto">
                {searchOpen && (
                    <div className="input-group input-group-sm w-100 w-md-auto">
                        <input
                            type="search"
                            className="form-control form-control-dark"
                            placeholder="Search menu or guests"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <button type="button" className="btn btn-gold" onClick={toggleSearch}>
                            Close
                        </button>
                    </div>
                )}
                <button className="btn btn-outline-gold btn-sm" onClick={toggleSearch}>
                    {searchOpen ? 'Hide search' : 'Search'}
                </button>
                <button className="btn btn-outline-gold btn-sm" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default HeaderNavbar;
