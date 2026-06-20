import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { menuItems, addToCart, updateCartQuantity, cartItems, searchQuery, setSearchQuery, formatCurrency } = useApp();

    const availableMenuItems = useMemo(() => menuItems.filter((item) => item.available !== false), [menuItems]);

    const filteredMenuItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return availableMenuItems;
        return availableMenuItems.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query))
        );
    }, [availableMenuItems, searchQuery]);

    const categories = useMemo(() => {
        const cats = [...new Set(availableMenuItems.map((item) => item.category))];
        return cats.sort();
    }, [availableMenuItems]);

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Our Menu</h2>
                    <p className="text-muted mb-0">Discover authentic Indian cuisine with 60+ dishes</p>
                </div>
                <div className="input-group w-auto">
                    <input
                        type="search"
                        className="form-control"
                        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.16)', color: '#f7f3e9' }}
                        placeholder="Search dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {categories.length > 0 && (
                <div className="d-flex gap-2 flex-wrap mb-4">
                    {categories.map((cat) => (
                        <span key={cat} className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            <div className="row g-4">
                {filteredMenuItems.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                    <div className="col-12 col-md-6 col-lg-4" key={itemId}>
                        <div className="card h-100 shadow-sm border-0" style={{ background: '#101010', color: '#f2efe4' }}>
                            <div className="position-relative" style={{ height: '160px', background: '#1a1a1a', overflow: 'hidden' }}>
                                {typeof item.image === 'string' && (item.image.includes('/') || item.image.endsWith('.svg') || item.image.endsWith('.jpg') || item.image.endsWith('.png')) ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100" style={{ fontSize: '4rem' }}>
                                        {item.image}
                                    </div>
                                )}
                                {!item.available && (
                                    <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark" style={{ opacity: 0.75 }}>
                                        <div className="d-flex align-items-center justify-content-center h-100 text-white fw-bold">Out of Stock</div>
                                    </div>
                                )}
                                {item.featured && <span className="badge position-absolute top-2 end-2" style={{ background: '#d4af37', color: '#111' }}>Featured</span>}
                            </div>
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-0">
                                        <span className="me-2">{typeof item.image === 'string' && !item.image.includes('/') ? item.image : ''}</span>
                                        {item.name}
                                    </h5>
                                    <span className="badge rounded-pill" style={{ background: '#d4af37', color: '#111' }}>
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                                <span className="badge mb-2 align-self-start" style={{ background: 'rgba(255,255,255,0.08)', color: '#d8d4ce' }}>
                                    {item.category}
                                </span>
                                <p className="card-text small flex-grow-1 mb-2" style={{ color: 'rgba(255,255,255,0.67)' }}>
                                    {item.description}
                                </p>
                                {item.rating && (
                                    <div className="mb-2">
                                        <span style={{ color: '#d4af37' }}>{'★'.repeat(Math.floor(item.rating))}</span>
                                        <span className="small ms-1" style={{ color: 'rgba(255,255,255,0.67)' }}>{item.rating}/5</span>
                                    </div>
                                )}
                                <div className="mt-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <button 
                                            className="btn btn-sm btn-outline-gold"
                                            onClick={() => {
                                                const existing = cartItems.find((ci) => (ci.id === item.id || ci._id === item._id));
                                                if (existing) {
                                                    updateCartQuantity(item.id || item._id, existing.quantity + 1);
                                                } else {
                                                    addToCart(item);
                                                }
                                            }}
                                            disabled={!item.available}
                                        >
                                            +
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-gold"
                                            onClick={() => addToCart(item)}
                                            disabled={!item.available}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })}

                {filteredMenuItems.length === 0 && (
                    <div className="col-12 text-center py-5" style={{ color: 'rgba(255,255,255,0.67)' }}>
                        No dishes found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;