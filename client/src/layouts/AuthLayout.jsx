import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="auth-layout d-flex align-items-center justify-content-center min-vh-100">
            <div className="auth-shell p-4 rounded-4 shadow-lg">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
