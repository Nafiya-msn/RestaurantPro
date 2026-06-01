import api from './api';

const addReview = async (review) => {
    const { data } = await api.post('/reviews', review);
    return data;
};

const fetchReviews = async (params = {}) => {
    const { data } = await api.get('/reviews', { params });
    return data;
};

export { addReview, fetchReviews };