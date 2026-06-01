import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login, register, getProfile } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('restaurantpro_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);
    const [authInitializing, setAuthInitializing] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (!user?.token) {
            setAuthInitializing(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const profile = await getProfile();
                setUser((current) => ({ ...current, ...profile }));
                setError(null);
            } catch (err) {
                setUser(null);
                localStorage.removeItem('restaurantpro_user');
            } finally {
                setAuthInitializing(false);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('restaurantpro_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('restaurantpro_user');
        }
    }, [user]);

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await login(credentials);
            setUser(data);
            showToast(`Welcome back, ${data.name}!`, 'success');
            return data;
        } catch (err) {
            const message = err.message || 'Login failed';
            setError(message);
            showToast(message, 'danger');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await register(payload);
            setUser(data);
            showToast('Your account has been created successfully.', 'success');
            return data;
        } catch (err) {
            const message = err.message || 'Registration failed';
            setError(message);
            showToast(message, 'danger');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setError(null);
        showToast('You have been logged out.', 'info');
    };

    const handleUpdateProfile = async (updatedValues) => {
        setUser((current) => ({ ...current, ...updatedValues }));
        showToast('Profile updated successfully.', 'success');
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            authInitializing,
            error,
            handleLogin,
            handleRegister,
            handleLogout,
            handleUpdateProfile,
        }),
        [user, loading, authInitializing, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
