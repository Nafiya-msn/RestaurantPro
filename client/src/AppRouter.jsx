import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import OrdersPage from './pages/OrdersPage';
import MenuManagementPage from './pages/MenuManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import StaffManagementPage from './pages/StaffManagementPage';
import ProfilePage from './pages/ProfilePage';

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<MenuManagementPage />} />
                <Route path="customers" element={<CustomerManagementPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/auth/login'} replace />} />
        </Routes>
    );
};

export { AppRouter };
