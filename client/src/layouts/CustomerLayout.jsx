import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/common/CustomerNavbar';

const CustomerLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: 'linear-gradient(180deg, #070707 0%, #0d0d0d 100%)', color: '#f8f7ee' }}>
            <CustomerNavbar />
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;