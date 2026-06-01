import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

const MenuManagementPage = () => {
    const {
        filteredMenuItems,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        placeOrder,
        addMenuItem,
        formatCurrency,
        menuItems,
        searchQuery,
        setSearchQuery,
    } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 30]);
    const [orderType, setOrderType] = useState('Dine-in');
    const [newDish, setNewDish] = useState({ name: '', category: 'Biryani', price: '', description: '' });

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(menuItems.map((item) => item.category))];
        return cats.sort();
    }, [menuItems]);

    const filteredByCategory = useMemo(
        () =>
            selectedCategory === 'All'
                ? filteredMenuItems
                : filteredMenuItems.filter((item) => item.category === selectedCategory),
        [filteredMenuItems, selectedCategory]
    );

    const filteredByPrice = useMemo(
        () => filteredByCategory.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]),
        [filteredByCategory, priceRange]
    );

    const featuredDishes = useMemo(() => menuItems.filter((item) => item.featured).slice(0, 8), [menuItems]);
    const popularDishes = useMemo(
        () => [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 6),
        [menuItems]
    );

    const handleCreateDish = (event) => {
        event.preventDefault();
        if (!newDish.name.trim() || !newDish.price.trim()) return;
        addMenuItem(newDish);
        setNewDish({ name: '', category: 'Biryani', price: '', description: '' });
        setShowForm(false);
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <span className="text-warning">
                {Array.from({ length: full }, () => '★').join('')}
                {half ? '½' : ''}
                {Array.from({ length: 5 - full - (half ? 1 : 0) }, () => '☆').join('')}
            </span>
        );
    };

    const MenuItem = ({ item }) => (
        <div className="card border-0 shadow-sm bg-black text-white h-100 position-relative">
            <div className="position-relative" style={{ height: '140px', background: '#1a1a1a', overflow: 'hidden' }}>
                {typeof item.image === 'string' && (item.image.includes('/') || item.image.endsWith('.svg') || item.image.endsWith('.jpg') || item.image.endsWith('.png')) ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-white" style={{ fontSize: '3rem' }}>
                        {item.image}
                    </div>
                )}
                {!item.available && (
                    <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark" style={{ opacity: 0.7 }}>
                        <div className="d-flex align-items-center justify-content-center h-100 text-white fw-bold">Out of Stock</div>
                    </div>
                )}
                {item.featured && <span className="badge bg-gold text-dark position-absolute top-2 end-2">Featured</span>}
            </div>
            <div className="card-body d-flex flex-column">
                <h5 className="mb-1 text-white">{item.name}</h5>
                <p className="text-muted small mb-2">{item.category}</p>
                <p className="text-muted small flex-grow-1 mb-2">{item.description}</p>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <div className="small">{renderStars(item.rating)}</div>
                        <div className="text-muted small">{item.rating}/5</div>
                    </div>
                    <strong className="text-gold" style={{ fontSize: '1.1rem' }}>
                        {formatCurrency(item.price)}
                    </strong>
                </div>
                <button
                    className="btn btn-sm btn-gold w-100"
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                >
                    {item.available ? 'Add to cart' : 'Unavailable'}
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <p className="text-gold text-uppercase small mb-2">Premium Menu</p>
                    <h2 className="fw-bold text-white">Explore authentic Indian cuisine</h2>
                    <p className="text-muted mb-0">Discover 60+ dishes with premium ingredients and traditional recipes.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-gold" onClick={() => setShowForm((current) => !current)}>
                        {showForm ? 'Close form' : 'Add item'}
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => placeOrder(orderType)}>
                        Order now
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card border-0 shadow-sm bg-black text-white mb-4 p-3">
                <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label text-muted small">Search dishes</label>
                        <input
                            type="text"
                            className="form-control form-control-dark"
                            placeholder="Search by name or description"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label text-muted small">Category</label>
                        <select
                            className="form-select form-control-dark"
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label text-muted small">Max price: {formatCurrency(priceRange[1])}</label>
                        <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="30"
                            value={priceRange[1]}
                            onChange={(event) => setPriceRange([priceRange[0], parseFloat(event.target.value)])}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label className="form-label text-muted small">Results: {filteredByPrice.length}</label>
                        <button
                            className="btn btn-outline-gold w-100"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                                setPriceRange([0, 30]);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="card border-0 shadow-sm bg-black text-white mb-4">
                    <div className="card-body">
                        <h5 className="mb-3">Add new menu item</h5>
                        <form onSubmit={handleCreateDish}>
                            <div className="row g-3 align-items-end">
                                <div className="col-sm-6 col-lg-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={newDish.name}
                                        className="form-control form-control-dark"
                                        onChange={(event) => setNewDish((current) => ({ ...current, name: event.target.value }))}
                                        placeholder="Dish name"
                                    />
                                </div>
                                <div className="col-sm-6 col-lg-2">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select form-control-dark"
                                        value={newDish.category}
                                        onChange={(event) => setNewDish((current) => ({ ...current, category: event.target.value }))}
                                    >
                                        {categories.filter((c) => c !== 'All').map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-6 col-lg-2">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={newDish.price}
                                        className="form-control form-control-dark"
                                        onChange={(event) => setNewDish((current) => ({ ...current, price: event.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        value={newDish.description}
                                        className="form-control form-control-dark"
                                        onChange={(event) => setNewDish((current) => ({ ...current, description: event.target.value }))}
                                        placeholder="Short description"
                                    />
                                </div>
                                <div className="col-12 col-lg-2">
                                    <button type="submit" className="btn btn-gold w-100">
                                        Add item
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Featured Dishes */}
            <div className="mb-5">
                <div className="mb-3">
                    <h5 className="text-gold text-uppercase small">✨ Featured & Popular</h5>
                    <p className="text-muted">Chef's special recommendations</p>
                </div>
                <div className="row g-3 mb-5">
                    {featuredDishes.map((item) => (
                        <div className="col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                            <MenuItem item={item} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Dishes by Rating */}
            <div className="mb-5">
                <div className="mb-3">
                    <h5 className="text-gold text-uppercase small">⭐ Top Rated</h5>
                    <p className="text-muted">Guest favorites and highest rated items</p>
                </div>
                <div className="row g-3 mb-5">
                    {popularDishes.map((item) => (
                        <div className="col-sm-6 col-lg-4 col-xl-2" key={item.id}>
                            <MenuItem item={item} />
                        </div>
                    ))}
                </div>
            </div>

            {/* All Items by Filter */}
            <div>
                <div className="mb-3">
                    <h5 className="text-gold text-uppercase small">🍽️ All items</h5>
                    <p className="text-muted">
                        {filteredByPrice.length} of {menuItems.length} dishes
                    </p>
                </div>
                {filteredByPrice.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        No items match your filters. Try adjusting your search or price range.
                    </div>
                ) : (
                    <div className="row g-3 mb-4">
                        {filteredByPrice.map((item) => (
                            <div className="col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                                <MenuItem item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            <div className="card border-0 shadow-sm bg-black text-white mt-4 sticky-bottom mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h6 className="mb-0">Active cart</h6>
                            <p className="text-muted small mb-0">{cartItems.length} item{cartItems.length === 1 ? '' : 's'}</p>
                        </div>
                        <span className="badge bg-gold text-dark" style={{ fontSize: '1rem' }}>
                            {formatCurrency(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                        </span>
                    </div>

                    <div className="mb-2">
                        <label className="form-label small text-muted">Order type</label>
                        <select className="form-select form-control-dark form-select-sm" value={orderType} onChange={(event) => setOrderType(event.target.value)}>
                            <option>Dine-in</option>
                            <option>Delivery</option>
                            <option>Takeaway</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-gold btn-sm flex-grow-1" onClick={() => placeOrder(orderType)}>
                            Checkout
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuManagementPage;
