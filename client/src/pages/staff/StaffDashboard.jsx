import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { orders, cycleOrderStatus } = useApp();

    const activeOrders = useMemo(() => orders.filter((o) => (o.orderStatus || o.status) !== 'completed' && (o.orderStatus || o.status) !== 'cancelled'), [orders]);

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Staff Dashboard</p>
                    <h2 className="fw-bold text-white">Active Service</h2>
                    <p className="text-muted mb-0">Manage incoming orders and update their status.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-gold" onClick={() => navigate('/staff/menu')}>
                        View Menu Availability
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => navigate('/staff/orders')}>
                        All Orders
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm bg-black text-white">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="mb-0">Current Orders</h5>
                        <span className="badge bg-gold text-dark">{activeOrders.length} Pending</span>
                    </div>
                    <div className="list-group list-group-flush">
                        {activeOrders.map((order) => {
                            const orderStatus = order.orderStatus || order.status;
                            const orderId = order._id || order.id;
                            const customerName = order.customer?.name || order.customer || 'Unknown';
                            const orderType = order.orderType || order.type;
                            const itemsText = Array.isArray(order.items) 
                                ? order.items.map(i => typeof i === 'string' ? i : `${i.name} x${i.quantity}`).join(', ') 
                                : '';

                            return (
                            <div key={orderId} className="list-group-item bg-transparent border-bottom border-secondary text-white py-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="fw-semibold fs-5">{orderId}</div>
                                        <div className="text-muted">{customerName} · {orderType}</div>
                                    </div>
                                    <button 
                                        className={`btn btn-sm ${orderStatus === 'ready' ? 'btn-success' : (orderStatus === 'preparing' || orderStatus === 'received') ? 'btn-warning text-dark' : 'btn-outline-light'}`}
                                        onClick={() => cycleOrderStatus(orderId)}
                                    >
                                        {orderStatus.toUpperCase()} 
                                        {orderStatus !== 'completed' && ' ➔'}
                                    </button>
                                </div>
                                <div className="text-light mt-2">{itemsText}</div>
                            </div>
                            );
                        })}
                        {activeOrders.length === 0 && (
                            <div className="py-4 text-center text-muted">
                                No active orders right now.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
