import api from './api';

const getTeamMembers = async () => {
    const { data } = await api.get('/team');
    return data;
};

const addTeamMember = async (member) => {
    const { data } = await api.post('/team', member);
    return data;
};

const updateTeamMember = async (id, member) => {
    const { data } = await api.put(`/team/${id}`, member);
    return data;
};

const deleteTeamMember = async (id) => {
    const { data } = await api.delete(`/team/${id}`);
    return data;
};

export { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember };