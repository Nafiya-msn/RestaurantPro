import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('restaurantpro_user');
    if (stored) {
        const user = JSON.parse(stored);
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const payload = error.response?.data;
        const message = payload?.message || error.message || 'Unable to reach server, please try again.';

        if (!error.response) {
            return Promise.reject(new Error('Unable to connect to backend server. Make sure the backend is running.'));
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('restaurantpro_user');
        }

        return Promise.reject(new Error(message));
    }
);

export default api;
