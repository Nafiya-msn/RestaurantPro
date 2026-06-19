import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/common/CustomerNavbar';

const CustomerLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light text-dark">
            <CustomerNavbar />
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
