import api from './api';

const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

const register = async ({ name, email, password, role }) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
};

const getProfile = async () => {
    const { data } = await api.get('/auth/profile');
    return data;
};

export { login, register, getProfile };

