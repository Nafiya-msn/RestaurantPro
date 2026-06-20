import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const OrderTrackingPage = () => {
    const { orders, formatCurrency } = useApp();
    const { user } = useAuth();
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const customerOrders = useMemo(() => {
        if (!user) return [];
        return orders
            .filter((order) => {
                const orderCustomerId = typeof order.customer === 'object' ? order.customer?._id : order.customer;
                return String(orderCustomerId) === String(user._id);
            })
            .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
    }, [orders, user]);

    const selectedOrder = useMemo(() => {
        if (!selectedOrderId) return null;
        return customerOrders.find((order) => (order._id || order.id) === selectedOrderId) || null;
    }, [customerOrders, selectedOrderId]);

    const getStatusBadge = (status) => {
        const map = {
            received: 'bg-info',
            preparing: 'bg-warning text-dark',
            ready: 'bg-success',
            completed: 'bg-success',
            cancelled: 'bg-danger',
            pending: 'bg-secondary',
            confirmed: 'bg-info',
            delivered: 'bg-success',
        };
        return map[status] || 'bg-secondary';
    };

    const getStatusLabel = (status) => {
        const map = {
            received: 'Order Received',
            preparing: 'Preparing',
            ready: 'Ready for Pickup',
            completed: 'Completed',
            cancelled: 'Cancelled',
            pending: 'Pending',
            confirmed: 'Confirmed',
            delivered: 'Delivered',
        };
        return map[status] || status || 'Unknown';
    };

    const getProgress = (status) => {
        const map = {
            received: 1,
            pending: 1,
            confirmed: 1,
            preparing: 2,
            ready: 3,
            completed: 4,
            delivered: 4,
            cancelled: 0,
        };
        return map[status] || 0;
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-0">My Orders</h2>
                <p className="text-muted mb-0">Track your order status and history</p>
            </div>

            {customerOrders.length === 0 ? (
                <div className="text-center py-5" style={{ color: 'rgba(255,255,255,0.67)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                    <h4 className="fw-bold mb-2">No orders yet</h4>
                    <p className="text-muted mb-4">Your order history will appear here.</p>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm" style={{ background: '#101010', color: '#f2efe4' }}>
                            <div className="card-body p-0">
                                <div className="list-group list-group-flush">
                                    {customerOrders.map((order) => {
                                        const orderId = order._id || order.id;
                                        const orderStatus = order.orderStatus || order.status;
                                        return (
                                            <button
                                                key={orderId}
                                                className={`list-group-item list-group-item-action bg-transparent border-secondary text-white ${selectedOrderId === orderId ? 'active' : ''}`}
                                                style={selectedOrderId === orderId ? { background: 'rgba(212, 175, 55, 0.15)' } : {}}
                                                onClick={() => setSelectedOrderId(orderId)}
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-semibold">Order #{String(orderId).slice(-6)}</div>
                                                        <div className="small text-muted">{order.orderType || order.type}</div>
                                                    </div>
                                                    <span className={`badge ${getStatusBadge(orderStatus)}`}>
                                                        {getStatusLabel(orderStatus)}
                                                    </span>
                                                </div>
                                                <div className="small text-muted mt-1">
                                                    {formatCurrency(order.totalAmount || order.total || 0)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        {selectedOrder ? (
                            <div className="card border-0 shadow-sm" style={{ background: '#101010', color: '#f2efe4' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div>
                                            <h5 className="fw-bold mb-1">Order #{String(selectedOrder._id || selectedOrder.id).slice(-6)}</h5>
                                            <p className="text-muted small mb-0">
                                                {new Date(selectedOrder.createdAt || selectedOrder._id).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`badge ${getStatusBadge(selectedOrder.orderStatus || selectedOrder.status)}`}>
                                            {getStatusLabel(selectedOrder.orderStatus || selectedOrder.status)}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">Order Progress</h6>
                                        <div className="d-flex align-items-center gap-2">
                                            {['Received', 'Preparing', 'Ready', 'Completed'].map((step, index) => {
                                                const progress = getProgress(selectedOrder.orderStatus || selectedOrder.status);
                                                const stepNum = index + 1;
                                                const isActive = progress >= stepNum && progress > 0;
                                                const isCurrent = progress === stepNum;
                                                return (
                                                    <div key={step} className="d-flex align-items-center flex-grow-1">
                                                        <div className="d-flex flex-column align-items-center">
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    background: isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                                                                    color: isActive ? '#111' : 'rgba(255,255,255,0.5)',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.85rem',
                                                                }}
                                                            >
                                                                {stepNum}
                                                            </div>
                                                            <span className="small mt-1" style={{ color: isActive ? '#d4af37' : 'rgba(255,255,255,0.5)' }}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                        {index < 3 && (
                                                            <div
                                                                className="flex-grow-1 mx-2"
                                                                style={{
                                                                    height: '2px',
                                                                    background: progress > stepNum ? '#d4af37' : 'rgba(255,255,255,0.1)',
                                                                    marginTop: '-16px',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <h6 className="fw-bold mb-3">Order Items</h6>
                                    <div className="list-group list-group-flush mb-4">
                                        {(selectedOrder.items || []).map((item, idx) => (
                                            <div key={idx} className="list-group-item bg-transparent border-secondary text-white d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="fw-semibold">{item.name}</span>
                                                    <span className="text-muted small ms-2">x{item.quantity}</span>
                                                </div>
                                                <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <span className="text-muted small">Order Type</span>
                                            <div className="fw-semibold">{selectedOrder.orderType || selectedOrder.type}</div>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-muted small">Total</span>
                                            <div className="fw-bold text-gold" style={{ fontSize: '1.25rem' }}>
                                                {formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5" style={{ color: 'rgba(255,255,255,0.67)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👈</div>
                                <p>Select an order from the list to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTrackingPage;