import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import HeaderNavbar from '../components/common/HeaderNavbar';

const MainLayout = () => {
    return (
        <div className="d-flex main-layout min-vh-100">
            <Sidebar />
            <div className="content flex-grow-1 d-flex flex-column bg-dark">
                <HeaderNavbar />
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
