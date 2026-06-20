import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, cartTax, cartGrandTotal, clearCart, placeOrder, formatCurrency } = useApp();
    const [orderType, setOrderType] = useState('Dine-in');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        const result = await placeOrder(orderType);
        setSubmitting(false);
        if (result) {
            navigate('/customer/orders');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                    <h3 className="fw-bold mb-3">Your cart is empty</h3>
                    <p className="text-muted mb-4">Browse our menu and add some delicious items to get started.</p>
                    <button className="btn btn-gold" onClick={() => navigate('/customer/dashboard')}>
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Checkout</h2>
                    <p className="text-muted mb-0">Review your order and complete payment</p>
                </div>
                <button className="btn btn-outline-gold" onClick={() => navigate('/customer/cart')}>
                    Back to Cart
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4" style={{ background: '#101010', color: '#f2efe4' }}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Order Type</h5>
                            <div className="d-flex gap-2 mb-4">
                                {['Dine-in', 'Delivery', 'Takeaway'].map((type) => (
                                    <button
                                        key={type}
                                        className={`btn ${orderType === type ? 'btn-gold' : 'btn-outline-gold'}`}
                                        onClick={() => setOrderType(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <h5 className="fw-bold mb-3">Order Items</h5>
                            <div className="list-group list-group-flush">
                                {cartItems.map((item) => {
                                    const itemId = item._id || item.id;
                                    return (
                                        <div key={itemId} className="list-group-item bg-transparent border-secondary text-white d-flex align-items-center gap-3">
                                            <div style={{ fontSize: '2rem' }}>{item.image}</div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 fw-semibold">{item.name}</h6>
                                                <p className="text-muted small mb-0">{item.category}</p>
                                            </div>
                                            <div className="text-end">
                                                <p className="fw-bold mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-muted small mb-0">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-3">
                                <label className="form-label text-muted small">Special Instructions (optional)</label>
                                <textarea
                                    className="form-control form-control-dark"
                                    rows="2"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special requests..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ background: '#101010', color: '#f2efe4', top: '1rem' }}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Bill Summary</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tax (5%)</span>
                                <span className="fw-semibold">${cartTax.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Order Type</span>
                                <span className="fw-semibold">{orderType}</span>
                            </div>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold text-gold" style={{ fontSize: '1.25rem' }}>
                                    ${cartGrandTotal.toFixed(2)}
                                </span>
                            </div>
                            <button
                                className="btn btn-gold w-100"
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : `Place ${orderType} Order`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;