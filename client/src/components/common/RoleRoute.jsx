import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access an unauthorized route
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'staff':
                return <Navigate to="/staff/dashboard" replace />;
            case 'customer':
            default:
                return <Navigate to="/customer/dashboard" replace />;
        }
    }

    return children;
};

export default RoleRoute;
