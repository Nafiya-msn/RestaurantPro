import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RoleRoute from './components/common/RoleRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import CustomerLayout from './layouts/CustomerLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationsPage from './pages/ReservationsPage';
import OrdersPage from './pages/OrdersPage';
import MenuManagementPage from './pages/MenuManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import StaffManagementPage from './pages/StaffManagementPage';
import ProfilePage from './pages/ProfilePage';

// New Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import TeamMembersPage from './pages/staff/TeamMembersPage';
import GuestListPage from './pages/staff/GuestListPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerCartPage from './pages/customer/CustomerCartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <RoleRoute roles={['admin', 'staff', 'customer']}><Navigate to={`/${user.role}/dashboard`} replace /></RoleRoute> : <LandingPage />} />

            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<RoleRoute roles={['admin']}><MainLayout /></RoleRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<MenuManagementPage />} />
                <Route path="customers" element={<CustomerManagementPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<RoleRoute roles={['staff']}><MainLayout /></RoleRoute>}>
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<MenuManagementPage />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="guests" element={<GuestListPage />} />
                <Route path="team" element={<TeamMembersPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
            </Route>

            {/* Customer Routes */}
            <Route path="/customer" element={<RoleRoute roles={['customer']}><CustomerLayout /></RoleRoute>}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="cart" element={<CustomerCartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="tracking" element={<OrderTrackingPage />} />
                <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
            </Route>

            {/* Catch-all backwards compatibility */}
            <Route path="/dashboard" element={<RoleRoute roles={['admin', 'staff', 'customer']}><Navigate to={user ? `/${user.role}/dashboard` : '/auth/login'} replace /></RoleRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export { AppRouter };