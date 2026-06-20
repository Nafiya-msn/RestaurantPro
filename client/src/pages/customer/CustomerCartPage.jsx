import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CustomerCartPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, updateCartQuantity, removeCartItem, clearCart, placeOrder } = useApp();

    const handleCheckout = () => {
        navigate('/customer/checkout');
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
                    <h2 className="fw-bold mb-0">Your Cart</h2>
                    <p className="text-muted mb-0">{cartItems.length} item{cartItems.length === 1 ? '' : 's'} in your cart</p>
                </div>
                <button className="btn btn-outline-gold" onClick={clearCart}>
                    Clear Cart
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4" style={{ background: '#101010', color: '#f2efe4' }}>
                        <div className="card-body p-0">
                            {cartItems.map((item) => {
                                const itemId = item._id || item.id;
                                return (
                                    <div key={itemId} className="d-flex align-items-center gap-3 p-3 border-bottom border-secondary">
                                        <div className="flex-shrink-0" style={{ fontSize: '2.5rem' }}>
                                            {item.image}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-semibold">{item.name}</h6>
                                            <p className="text-muted small mb-0">{item.category}</p>
                                            <p className="text-gold fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button 
                                                className="btn btn-sm btn-outline-gold"
                                                onClick={() => updateCartQuantity(itemId, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="px-3">{item.quantity}</span>
                                            <button 
                                                className="btn btn-sm btn-outline-gold"
                                                onClick={() => updateCartQuantity(itemId, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeCartItem(itemId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ background: '#101010', color: '#f2efe4', top: '1rem' }}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tax (5%)</span>
                                <span className="fw-semibold">${(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold text-gold" style={{ fontSize: '1.25rem' }}>
                                    ${(cartTotal + cartTotal * 0.05).toFixed(2)}
                                </span>
                            </div>
                            <button className="btn btn-gold w-100" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCartPage;