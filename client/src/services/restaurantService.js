import api from './api';

const fetchRestaurants = async () => {
    const { data } = await api.get('/restaurants');
    return data;
};

const fetchRestaurantById = async (id) => {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
};

const createRestaurant = async (restaurant) => {
    const { data } = await api.post('/restaurants', restaurant);
    return data;
};

const updateRestaurant = async (id, restaurant) => {
    const { data } = await api.put(`/restaurants/${id}`, restaurant);
    return data;
};

const deleteRestaurant = async (id) => {
    const { data } = await api.delete(`/restaurants/${id}`);
    return data;
};

export { fetchRestaurants, fetchRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant };
