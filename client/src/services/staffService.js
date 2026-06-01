import api from './api';

const fetchStaff = async () => {
    const { data } = await api.get('/staff');
    return data;
};

const addStaff = async (staff) => {
    const { data } = await api.post('/staff', staff);
    return data;
};

const updateStaff = async (staffId, staff) => {
    const { data } = await api.put(`/staff/${staffId}`, staff);
    return data;
};

export { fetchStaff, addStaff, updateStaff };