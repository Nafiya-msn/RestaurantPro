import api from './api';

const login = async ({ email, password, accessCode }) => {
    const { data } = await api.post('/auth/login', { email, password, accessCode });
    return data;
};

const register = async ({ name, email, password, role, accessCode }) => {
    const { data } = await api.post('/auth/register', { name, email, password, role, accessCode });
    return data;
};

const getProfile = async () => {
    const { data } = await api.get('/auth/profile');
    return data;
};

export { login, register, getProfile };

