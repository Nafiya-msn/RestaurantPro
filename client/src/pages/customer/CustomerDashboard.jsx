import { useApp } from '../../context/AppContext';

const CustomerDashboard = () => {
    const { filteredMenuItems, addToCart, searchQuery, setSearchQuery } = useApp();

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Our Menu</h2>
                <div className="input-group w-auto">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="row g-4">
                {filteredMenuItems.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                    <div className="col-12 col-md-6 col-lg-4" key={itemId}>
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-0">
                                        <span className="me-2">{item.image}</span>
                                        {item.name}
                                    </h5>
                                    <span className="badge bg-primary rounded-pill">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                                <span className="badge bg-light text-dark align-self-start mb-2 border">
                                    {item.category}
                                </span>
                                <p className="card-text text-muted small flex-grow-1">
                                    {item.description}
                                </p>
                                <button
                                    className="btn btn-outline-primary w-100 mt-3"
                                    onClick={() => addToCart(item)}
                                    disabled={!item.available}
                                >
                                    {item.available ? 'Add to Cart' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    </div>
                    );
                })}

                {filteredMenuItems.length === 0 && (
                    <div className="col-12 text-center py-5 text-muted">
                        No dishes found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
