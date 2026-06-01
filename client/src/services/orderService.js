import api from './api';

const createOrder = async (order) => {
    const { data } = await api.post('/orders', order);
    return data;
};

const updateOrderStatus = async (orderId, status, paymentStatus) => {
    const { data } = await api.put(`/orders/${orderId}/status`, {
        orderStatus: status,
        paymentStatus,
    });
    return data;
};

const trackOrder = async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
};

const getCustomerOrders = async (customerId) => {
    const { data } = await api.get(`/orders/customer/${customerId}`);
    return data;
};

export { createOrder, updateOrderStatus, trackOrder, getCustomerOrders };