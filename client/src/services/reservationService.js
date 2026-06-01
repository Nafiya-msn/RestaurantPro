import api from './api';

const fetchReservations = async () => {
    const { data } = await api.get('/reservations');
    return data;
};

const createReservation = async (reservation) => {
    const { data } = await api.post('/reservations', reservation);
    return data;
};

const updateReservation = async (reservationId, reservation) => {
    const { data } = await api.put(`/reservations/${reservationId}`, reservation);
    return data;
};

const cancelReservation = async (reservationId) => {
    const { data } = await api.put(`/reservations/${reservationId}/cancel`);
    return data;
};

export { fetchReservations, createReservation, updateReservation, cancelReservation };