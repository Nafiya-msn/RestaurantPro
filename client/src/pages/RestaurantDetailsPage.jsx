import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRestaurantById } from '../services/restaurantService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const RestaurantDetailsPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRestaurant = async () => {
            try {
                setRestaurant(await fetchRestaurantById(id));
            } catch (err) {
                setError(err.message || 'Restaurant details not found');
            } finally {
                setLoading(false);
            }
        };

        loadRestaurant();
    }, [id]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Restaurant Details</h1>
                    <p className="text-muted">Detailed view and menu items.</p>
                </div>
                <Link to="/restaurants" className="btn btn-outline-secondary">
                    Back to list
                </Link>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : restaurant ? (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h3>{restaurant.name}</h3>
                        <p className="text-muted mb-2">{restaurant.cuisine || 'Cuisine not specified'}</p>
                        <p>{restaurant.description || 'No description provided.'}</p>
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <strong>Address</strong>
                                <p>{restaurant.address}</p>
                            </div>
                            <div className="col-md-4">
                                <strong>Phone</strong>
                                <p>{restaurant.phone}</p>
                            </div>
                            <div className="col-md-4">
                                <strong>Email</strong>
                                <p>{restaurant.email || 'Not available'}</p>
                            </div>
                        </div>
                        <h5>Menu</h5>
                        {restaurant.menu.length === 0 ? (
                            <Message variant="info">No menu items available.</Message>
                        ) : (
                            <div className="row g-3">
                                {restaurant.menu.map((item, index) => (
                                    <div className="col-md-4" key={index}>
                                        <div className="card border-light h-100">
                                            <div className="card-body">
                                                <h6>{item.name}</h6>
                                                <p className="small text-muted mb-2">{item.category || 'Menu item'}</p>
                                                <p className="mb-2">{item.description || 'No description.'}</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold">${item.price.toFixed(2)}</span>
                                                    <span className={`badge ${item.available ? 'bg-success' : 'bg-secondary'}`}>
                                                        {item.available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Message variant="warning">Restaurant could not be loaded.</Message>
            )}
        </div>
    );
};

export default RestaurantDetailsPage;
