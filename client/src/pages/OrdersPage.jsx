import { useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';

const OrdersPage = () => {
    const { orders, cartItems, placeOrder, cycleOrderStatus, formatCurrency } = useApp();
    const { showToast } = useToast();

    const handleSyncKitchen = () => {
        showToast('Kitchen sync complete. All stations updated.', 'success');
    };

    const handleNewOrder = () => {
        if (cartItems.length === 0) {
            showToast('Add items to the cart before placing a new order.', 'warning');
            return;
        }
        placeOrder('Delivery');
    };

    const handleTrack = (order) => {
        showToast(`Order ${order.id} is currently ${order.status}.`, 'info');
    };

    const sortedOrders = useMemo(() => [...orders].sort((a, b) => (a.status === 'completed' ? 1 : -1)), [orders]);

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Orders</p>
                    <h2 className="fw-bold text-white">Order management flow</h2>
                    <p className="text-muted mb-0">Track kitchen progress and order status with responsive controls.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-gold" onClick={handleSyncKitchen}>
                        Sync kitchen
                    </button>
                    <button className="btn btn-gold" onClick={handleNewOrder}>
                        New delivery order
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm bg-black text-white">
                <div className="card-body p-0 overflow-auto">
                    <table className="table table-dark table-borderless mb-0">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.type}</td>
                                    <td>{formatCurrency(order.total)}</td>
                                    <td>
                                        <span className={`badge ${order.status === 'completed' ? 'bg-success' : order.status === 'ready' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-gold me-2" onClick={() => handleTrack(order)}>
                                            Track
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => cycleOrderStatus(order.id)}>
                                            Advance
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
