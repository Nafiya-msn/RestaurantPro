import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatsCard from '../../components/common/StatsCard';
import ChartCard from '../../components/common/ChartCard';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { orders, reservations, cartItems, totalRevenue, topDishes, reviews, formatCurrency } = useApp();

    const pendingOrders = orders.filter((order) => (order.orderStatus || order.status) !== 'completed').length;
    const confirmedGuests = reservations.filter((reservation) => reservation.status === 'confirmed').reduce((sum, reservation) => sum + reservation.guests, 0);
    const revenueCard = formatCurrency(totalRevenue);

    const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
    const upcomingReservations = useMemo(
        () => reservations.filter((reservation) => reservation.status !== 'cancelled').slice(0, 3),
        [reservations]
    );

    const summary = [
        { title: 'Open orders', value: String(pendingOrders), subtitle: 'Kitchen load in real time', icon: '🍽' },
        { title: 'Confirmed guests', value: String(confirmedGuests), subtitle: 'Upcoming reservations today', icon: '👥' },
        { title: 'Cart value', value: formatCurrency(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)), subtitle: 'Ready to process', icon: '🛒' },
        { title: 'Revenue so far', value: revenueCard, subtitle: 'Gross sales this session', icon: '💰' },
    ];

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Admin Dashboard</p>
                    <h2 className="fw-bold text-white">All operations in one view</h2>
                    <p className="text-muted mb-0">Monitor orders, reservations, menu activity, and guest feedback from a premium control center.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-gold" onClick={() => navigate('/admin/menu')}>
                        Manage menu
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => navigate('/admin/reservations')}>
                        Reservations
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => navigate('/admin/orders')}>
                        Review orders
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {summary.map((item) => (
                    <div className="col-12 col-md-6 col-xl-3" key={item.title}>
                        <StatsCard {...item} />
                    </div>
                ))}
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <ChartCard title="Booking cadence" description="Guest pace across service hours">
                        <div className="chart-lines mb-4">
                            {['17:00', '18:00', '19:00', '20:00', '21:00'].map((label, index) => (
                                <div key={label} className="chart-line d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-muted">{label}</span>
                                    <div className="chart-bar" style={{ width: `${35 + index * 12}%` }} />
                                </div>
                            ))}
                        </div>
                        <p className="text-muted small mb-0">Track reservation energy during service windows.</p>
                    </ChartCard>
                </div>
                <div className="col-12 col-lg-6">
                    <ChartCard title="Top dishes" description="Premium items on the menu">
                        <div className="popular-dishes mt-3">
                            {topDishes.map((dish) => (
                                <div key={dish._id || dish.id} className="popular-dish">
                                    <span className="dish-dot bg-gold" />
                                    <div>
                                        <div className="text-white fw-semibold">{dish.name}</div>
                                        <div className="text-muted small">{dish.category} • {formatCurrency(dish.price)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm bg-black text-white">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Recent orders</h5>
                                <span className="badge bg-gold text-dark">Latest</span>
                            </div>
                            <div className="list-group list-group-flush">
                                {recentOrders.map((order) => {
                                    const orderStatus = order.orderStatus || order.status;
                                    const orderId = order._id || order.id;
                                    const customerName = order.customer?.name || order.customer || 'Unknown';
                                    const orderType = order.orderType || order.type;
                                    const itemsText = Array.isArray(order.items) 
                                        ? order.items.map(i => typeof i === 'string' ? i : `${i.name} x${i.quantity}`).join(', ') 
                                        : '';

                                    return (
                                    <div key={orderId} className="list-group-item bg-transparent border-bottom border-secondary text-white">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div className="fw-semibold">{orderId}</div>
                                                <div className="small text-muted">{customerName} · {orderType}</div>
                                            </div>
                                            <span className={`badge ${orderStatus === 'completed' ? 'bg-success' : (orderStatus === 'ready' || orderStatus === 'received') ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {orderStatus}
                                            </span>
                                        </div>
                                        <div className="small text-muted mt-2">{itemsText}</div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm bg-black text-white">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Upcoming reservations</h5>
                                <span className="badge bg-gold text-dark">Priority</span>
                            </div>
                            <div className="list-group list-group-flush">
                                {upcomingReservations.map((reservation) => (
                                    <div key={reservation._id || reservation.id} className="list-group-item bg-transparent border-bottom border-secondary text-white">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div className="fw-semibold">{reservation.name}</div>
                                                <div className="small text-muted">{reservation.time} · {reservation.guests} guests</div>
                                            </div>
                                            <span className={`badge ${reservation.status === 'confirmed' ? 'bg-success' : reservation.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {reservation.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
