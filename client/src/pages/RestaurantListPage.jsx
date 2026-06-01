import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../services/restaurantService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const RestaurantListPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                setRestaurants(await fetchRestaurants());
            } catch (err) {
                setError(err.message || 'Unable to load restaurants');
            } finally {
                setLoading(false);
            }
        };

        loadRestaurants();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Restaurants</h1>
                    <p className="text-muted">View and manage restaurant locations.</p>
                </div>
                <Link to="/" className="btn btn-outline-primary">
                    Back to Dashboard
                </Link>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : restaurants.length === 0 ? (
                <Message variant="info">No restaurants registered yet.</Message>
            ) : (
                <div className="row g-3">
                    {restaurants.map((restaurant) => (
                        <div className="col-md-6" key={restaurant._id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text text-truncate">{restaurant.description}</p>
                                    <p className="mb-1">
                                        <strong>Cuisine:</strong> {restaurant.cuisine || 'General'}
                                    </p>
                                    <p className="mb-3">
                                        <strong>Phone:</strong> {restaurant.phone}
                                    </p>
                                    <Link className="btn btn-primary" to={`/restaurants/${restaurant._id}`}>
                                        View details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantListPage;
