import api from './api';

const fetchMenu = async (params = {}) => {
    const { data } = await api.get('/menu', { params });
    return data;
};

const addMenuItem = async (menuItem) => {
    const { data } = await api.post('/menu', menuItem);
    return data;
};

const updateMenuItem = async (id, menuItem) => {
    const { data } = await api.put(`/menu/${id}`, menuItem);
    return data;
};

const deleteMenuItem = async (id) => {
    const { data } = await api.delete(`/menu/${id}`);
    return data;
};

export { fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem };