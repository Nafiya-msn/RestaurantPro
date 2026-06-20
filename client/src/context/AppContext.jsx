import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { fetchMenu, addMenuItem as apiAddMenuItem, updateMenuItem as apiUpdateMenuItem, deleteMenuItem as apiDeleteMenuItem } from '../services/menuService';
import { createOrder as apiCreateOrder, getCustomerOrders, getAllOrders, updateOrderStatus as apiUpdateOrderStatus } from '../services/orderService';
import { getReservations as apiGetReservations, createReservation as apiCreateReservation, updateReservation as apiUpdateReservation, cancelReservation as apiCancelReservation } from '../services/reservationService';
import { getTeamMembers as apiGetTeamMembers, addTeamMember as apiAddTeamMember, updateTeamMember as apiUpdateTeamMember, deleteTeamMember as apiDeleteTeamMember } from '../services/teamService';

const AppContext = createContext();

const defaultMenuItems = [
    { id: 'b-001', name: 'Chicken Biryani', category: 'Biryani', price: 12.99, available: true, description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.8, featured: true },
    { id: 'b-002', name: 'Beef Biryani', category: 'Biryani', price: 14.99, available: true, description: 'Tender beef pieces layered with spiced rice and saffron.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.9, featured: true },
    { id: 'b-003', name: 'Mutton Biryani', category: 'Biryani', price: 16.99, available: true, description: 'Slow-cooked mutton with basmati rice and traditional spice blend.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.8, featured: false },
    { id: 'b-004', name: 'Alfaham Biryani', category: 'Biryani', price: 15.99, available: true, description: 'Arabic-style grilled chicken biryani with special spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.7, featured: false },
    { id: 'ar-001', name: 'Mandi', category: 'Arabic', price: 18.99, available: true, description: 'Traditional Yemeni rice dish with tender meat and aromatic spices.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.9, featured: true },
    { id: 'ar-002', name: 'Kuzhimandi', category: 'Arabic', price: 16.99, available: true, description: 'Malabar-style Arabic rice with chicken or mutton.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.8, featured: true },
    { id: 'ar-003', name: 'Alfaham', category: 'Arabic', price: 14.99, available: true, description: 'Grilled chicken with Arabic spices and rice.', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=400', rating: 4.7, featured: false },
    { id: 'ri-001', name: 'Fried Rice', category: 'Rice', price: 7.99, available: true, description: 'Classic fried rice with vegetables and soy sauce.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.4, featured: false },
    { id: 'ri-002', name: 'Chicken Fried Rice', category: 'Rice', price: 9.99, available: true, description: 'Rice stir-fried with chicken and vegetables.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.5, featured: false },
    { id: 'ri-003', name: 'Schezwan Rice', category: 'Rice', price: 10.99, available: true, description: 'Spicy fried rice with Schezwan sauce and vegetables.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.6, featured: false },
    { id: 'swa-001', name: 'Arabic Shawarma', category: 'Shawarma', price: 8.99, available: true, description: 'Traditional Arabic shawarma with garlic sauce and pickles.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.7, featured: true },
    { id: 'swa-002', name: 'Plate Shawarma', category: 'Shawarma', price: 10.99, available: true, description: 'Shawarma served on plate with rice and salad.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.6, featured: false },
    { id: 'swa-003', name: 'Mexican Shawarma', category: 'Shawarma', price: 9.49, available: true, description: 'Spicy Mexican-style shawarma with jalapeños.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', rating: 4.5, featured: false },
    { id: 'bg-001', name: 'Chicken Burger', category: 'Burger', price: 9.99, available: true, description: 'Crispy chicken fillet with lettuce and mayo.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.6, featured: false },
    { id: 'bg-002', name: 'Zinger Burger', category: 'Burger', price: 10.99, available: true, description: 'Spicy zinger chicken with crispy coating.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.7, featured: true },
    { id: 'bg-003', name: 'Cheese Burger', category: 'Burger', price: 11.99, available: true, description: 'Double cheese with beef patty and special sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.8, featured: true },
    { id: 'pz-001', name: 'Margherita Pizza', category: 'Pizza', price: 11.99, available: true, description: 'Classic tomato sauce, mozzarella, and fresh basil.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.7, featured: true },
    { id: 'pz-002', name: 'Chicken Pizza', category: 'Pizza', price: 13.99, available: true, description: 'Grilled chicken with bell peppers and mozzarella.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.8, featured: true },
    { id: 'pz-003', name: 'Pepperoni Pizza', category: 'Pizza', price: 12.99, available: true, description: 'Loaded with pepperoni and melted cheese.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.6, featured: false },
    { id: 'bro-001', name: 'Broast Quarter', category: 'Broast', price: 9.99, available: true, description: 'Crispy broast quarter with special spices.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.6, featured: false },
    { id: 'bro-002', name: 'Broast Half', category: 'Broast', price: 14.99, available: true, description: 'Half chicken broast with fries and drink.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.7, featured: true },
    { id: 'bro-003', name: 'Broast Full', category: 'Broast', price: 24.99, available: true, description: 'Full chicken broast with all sides and drinks.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 4.8, featured: true },
    { id: 'sn-001', name: 'Sandwich', category: 'Snacks', price: 5.99, available: true, description: 'Classic sandwich with fresh vegetables.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', rating: 4.3, featured: false },
    { id: 'sn-002', name: 'Club Sandwich', category: 'Snacks', price: 7.99, available: true, description: 'Triple-decker with chicken, egg, and bacon.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', rating: 4.6, featured: false },
    { id: 'sn-003', name: 'Nuggets', category: 'Snacks', price: 6.99, available: true, description: 'Crispy chicken nuggets with dipping sauce.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', rating: 4.5, featured: false },
    { id: 'sn-004', name: 'French Fries', category: 'Snacks', price: 4.99, available: true, description: 'Golden crispy fries with salt.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', rating: 4.4, featured: false },
    { id: 'j-001', name: 'Mango Juice', category: 'Juices', price: 4.49, available: true, description: 'Sweet mango juice with real fruit pulp.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.8, featured: true },
    { id: 'j-002', name: 'Watermelon Juice', category: 'Juices', price: 3.99, available: true, description: 'Fresh watermelon juice, perfect for summer.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.7, featured: false },
    { id: 'j-003', name: 'Orange Juice', category: 'Juices', price: 3.99, available: true, description: 'Freshly squeezed orange juice.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.6, featured: false },
    { id: 'j-004', name: 'Avocado Juice', category: 'Juices', price: 5.49, available: true, description: 'Creamy avocado juice with honey.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', rating: 4.5, featured: false },
    { id: 'sd-001', name: 'Coca Cola', category: 'Soft Drinks', price: 1.99, available: true, description: 'Classic Coca-Cola 330ml.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', rating: 4.5, featured: false },
    { id: 'sd-002', name: 'Pepsi', category: 'Soft Drinks', price: 1.99, available: true, description: 'Refreshing Pepsi 330ml.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', rating: 4.4, featured: false },
    { id: 'sd-003', name: 'Sprite', category: 'Soft Drinks', price: 1.99, available: true, description: 'Lemon-lime flavored soda 330ml.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', rating: 4.4, featured: false },
    { id: 'sd-004', name: 'Fanta Orange', category: 'Soft Drinks', price: 1.99, available: true, description: 'Orange flavored soft drink 330ml.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', rating: 4.3, featured: false },
    { id: 'd-001', name: 'Ice Cream', category: 'Desserts', price: 4.99, available: true, description: 'Creamy vanilla ice cream with toppings.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.6, featured: false },
    { id: 'd-002', name: 'Brownie', category: 'Desserts', price: 5.99, available: true, description: 'Warm chocolate brownie with nuts.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.7, featured: true },
    { id: 'd-003', name: 'Falooda', category: 'Desserts', price: 6.99, available: true, description: 'Traditional Indian dessert with vermicelli and ice cream.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.8, featured: true },
    { id: 'd-004', name: 'Kunafa', category: 'Desserts', price: 7.99, available: true, description: 'Middle Eastern sweet pastry with cheese.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', rating: 4.9, featured: true },
];

const loadAppState = () => {
    try {
        const saved = localStorage.getItem('restaurantpro_app_state');
        if (!saved) return null;
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const storedState = loadAppState();

    const [menuItems, setMenuItems] = useState(storedState?.menuItems ?? defaultMenuItems);
    const [cartItems, setCartItems] = useState(storedState?.cartItems ?? []);
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [reviews, setReviews] = useState(storedState?.reviews ?? []);
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const fetchedMenu = await fetchMenu();
                if (fetchedMenu && fetchedMenu.length > 0) {
                    setMenuItems(fetchedMenu);
                }
            } catch (err) {
                console.error('Error fetching menu:', err);
            }

            if (user) {
                try {
                    let fetchedOrders = [];
                    if (user.role === 'admin' || user.role === 'staff') {
                        fetchedOrders = await getAllOrders();
                    } else if (user.role === 'customer') {
                        fetchedOrders = await getCustomerOrders(user._id);
                    }
                    
                    if (fetchedOrders) {
                        setOrders(fetchedOrders);
                    }

                    const fetchedReservations = await apiGetReservations();
                    if (fetchedReservations) {
                        setReservations(fetchedReservations);
                    }

                    const fetchedTeam = await apiGetTeamMembers();
                    if (fetchedTeam) {
                        setTeamMembers(fetchedTeam);
                    }
                } catch (err) {
                    console.error('Error fetching data:', err);
                }
            }
            setLoading(false);
        };

        loadInitialData();
    }, [user]);

    useEffect(() => {
        localStorage.setItem(
            'restaurantpro_app_state',
            JSON.stringify({ cartItems, reservations, reviews })
        );
    }, [cartItems, reservations, reviews]);

    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    const cartTax = useMemo(() => cartTotal * 0.05, [cartTotal]);
    const cartGrandTotal = useMemo(() => cartTotal + cartTax, [cartTotal, cartTax]);

    const totalRevenue = useMemo(
        () => orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        [orders]
    );

    const filteredMenuItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return menuItems;
        return menuItems.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query))
        );
    }, [menuItems, searchQuery]);

    const addToCart = (menuItem) => {
        if (!menuItem.available) {
            showToast(`${menuItem.name} is currently unavailable.`, 'warning');
            return;
        }

        setCartItems((current) => {
            const existing = current.find((item) => item.id === menuItem.id || item._id === menuItem._id);
            if (existing) {
                return current.map((item) =>
                    (item.id === menuItem.id || item._id === menuItem._id) ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...current, { ...menuItem, quantity: 1 }];
        });

        showToast(`${menuItem.name} added to cart.`, 'success');
    };

    const updateCartQuantity = (id, quantity) => {
        setCartItems((current) =>
            current
                .map((item) => ((item.id === id || item._id === id) ? { ...item, quantity: Math.max(1, quantity) } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const removeCartItem = (id) => {
        setCartItems((current) => current.filter((item) => (item.id !== id && item._id !== id)));
        showToast('Item removed from cart.', 'info');
    };

    const clearCart = () => {
        setCartItems([]);
        showToast('Cart cleared.', 'info');
    };

    const placeOrder = async (type = 'Dine-in') => {
        if (cartItems.length === 0) {
            showToast('Add items to the cart before placing an order.', 'warning');
            return null;
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        try {
            const orderPayload = {
                items: cartItems.map((item) => ({
                    menuItem: item._id || item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                orderType: type.toLowerCase(),
                totalAmount,
                paymentStatus: 'pending'
            };

            const nextOrder = await apiCreateOrder(orderPayload);
            setOrders((current) => [nextOrder, ...current]);
            setCartItems([]);
            showToast(`Successfully placed a ${type.toLowerCase()} order.`, 'success');
            return nextOrder;
        } catch (err) {
            showToast(err?.response?.data?.message || 'Failed to place order.', 'danger');
            return null;
        }
    };

    const cycleOrderStatus = async (orderId) => {
        const order = orders.find((item) => item._id === orderId || item.id === orderId);
        if (!order) return;

        const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
        const currentStatus = order.orderStatus || order.status;
        const nextIndex = Math.min(statusFlow.indexOf(currentStatus) + 1, statusFlow.length - 1);
        const nextStatus = statusFlow[nextIndex];

        try {
            const updatedOrder = await apiUpdateOrderStatus(orderId, nextStatus);
            setOrders((current) =>
                current.map((item) => (item._id === orderId || item.id === orderId ? updatedOrder : item))
            );
            showToast(`Order ${updatedOrder._id} moved to ${nextStatus}.`, 'info');
        } catch (err) {
            showToast('Failed to update order status.', 'danger');
        }
    };

    const addMenuItem = async ({ name, category, price, description, image, available }) => {
        try {
            const payload = { 
                name, 
                category, 
                price: parseFloat(price) || 0, 
                description,
                image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                available: available !== false,
            };
            const nextItem = await apiAddMenuItem(payload);
            setMenuItems((current) => [nextItem, ...current]);
            showToast(`${name} added to the menu.`, 'success');
        } catch (err) {
            showToast('Failed to add menu item.', 'danger');
        }
    };

    const updateMenuItem = async (id, updates) => {
        try {
            const updated = await apiUpdateMenuItem(id, updates);
            setMenuItems((current) =>
                current.map((item) => (item._id === id || item.id === id ? updated : item))
            );
            showToast('Menu item updated.', 'success');
        } catch (err) {
            showToast('Failed to update menu item.', 'danger');
        }
    };

    const removeMenuItem = async (id) => {
        try {
            await apiDeleteMenuItem(id);
            setMenuItems((current) => current.filter((item) => item._id !== id && item.id !== id));
            showToast('Menu item removed.', 'info');
        } catch (err) {
            showToast('Failed to remove menu item.', 'danger');
        }
    };

    const createReservation = async ({ name, time, guests, notes }) => {
        try {
            const nextReservation = await apiCreateReservation({ 
                customerName: name,
                time,
                guests: Number(guests) || 2, 
                notes,
                reservationDate: new Date().toISOString(),
                tableNumber: Math.floor(Math.random() * 20) + 1,
            });
            setReservations((current) => [nextReservation, ...current]);
            showToast('Reservation confirmed.', 'success');
        } catch (err) {
            showToast('Failed to create reservation.', 'danger');
        }
    };

    const updateReservationStatus = async (reservationId, nextStatus) => {
        try {
            const updated = await apiUpdateReservation(reservationId, { status: nextStatus });
            setReservations((current) =>
                current.map((reservation) =>
                    reservation._id === reservationId ? updated : reservation
                )
            );
            showToast('Reservation status updated.', 'success');
        } catch (err) {
            showToast('Failed to update reservation.', 'danger');
        }
    };

    const cancelReservation = async (reservationId) => {
        try {
            const updated = await apiCancelReservation(reservationId);
            setReservations((current) =>
                current.map((reservation) =>
                    reservation._id === reservationId ? updated : reservation
                )
            );
            showToast('Reservation cancelled.', 'warning');
        } catch (err) {
            showToast('Failed to cancel reservation.', 'danger');
        }
    };

    const addTeamMember = async (memberData) => {
        try {
            const member = await apiAddTeamMember(memberData);
            setTeamMembers((current) => [member, ...current]);
            showToast('Team member added successfully.', 'success');
        } catch (err) {
            showToast('Failed to add team member.', 'danger');
        }
    };

    const updateTeamMember = async (id, updates) => {
        try {
            const updated = await apiUpdateTeamMember(id, updates);
            setTeamMembers((current) =>
                current.map((member) => (member._id === id || member.id === id ? updated : member))
            );
            showToast('Team member updated.', 'success');
        } catch (err) {
            showToast('Failed to update team member.', 'danger');
        }
    };

    const deleteTeamMember = async (id) => {
        try {
            await apiDeleteTeamMember(id);
            setTeamMembers((current) => current.filter((member) => member._id !== id && member.id !== id));
            showToast('Team member deleted.', 'info');
        } catch (err) {
            showToast('Failed to delete team member.', 'danger');
        }
    };

    const topDishes = useMemo(
        () =>
            [...menuItems]
                .sort((a, b) => b.price - a.price)
                .slice(0, 4),
        [menuItems]
    );

    const value = useMemo(
        () => ({
            menuItems,
            cartItems,
            orders,
            reservations,
            reviews,
            teamMembers,
            searchQuery,
            setSearchQuery,
            filteredMenuItems,
            cartTotal,
            cartTax,
            cartGrandTotal,
            totalRevenue,
            topDishes,
            formatCurrency,
            addToCart,
            updateCartQuantity,
            removeCartItem,
            clearCart,
            placeOrder,
            cycleOrderStatus,
            addMenuItem,
            updateMenuItem,
            removeMenuItem,
            createReservation,
            updateReservationStatus,
            cancelReservation,
            addTeamMember,
            updateTeamMember,
            deleteTeamMember,
            loading,
        }),
        [
            menuItems,
            cartItems,
            orders,
            reservations,
            reviews,
            teamMembers,
            searchQuery,
            filteredMenuItems,
            cartTotal,
            cartTax,
            cartGrandTotal,
            totalRevenue,
            topDishes,
            loading,
        ]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };