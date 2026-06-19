import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { fetchMenu, addMenuItem as apiAddMenuItem } from '../services/menuService';
import { createOrder as apiCreateOrder, getCustomerOrders, getAllOrders, updateOrderStatus as apiUpdateOrderStatus } from '../services/orderService';

const AppContext = createContext();

const defaultMenuItems = [
    // Biryani
    { id: 'b-001', name: 'Chicken Biryani', category: 'Biryani', price: 12.99, available: true, description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices.', image: '🍚', rating: 4.8, featured: true },
    { id: 'b-002', name: 'Hyderabadi Chicken Biryani', category: 'Biryani', price: 14.99, available: true, description: 'Authentic Hyderabadi-style biryani with marinated chicken and saffron rice.', image: '🍚', rating: 4.9, featured: true },
    { id: 'b-003', name: 'Malabar Biryani', category: 'Biryani', price: 15.99, available: true, description: 'Kerala-style biryani with coconut, curry leaves, and local spices.', image: '🍚', rating: 4.7, featured: false },
    { id: 'b-004', name: 'Mutton Biryani', category: 'Biryani', price: 16.99, available: true, description: 'Slow-cooked mutton with basmati rice and traditional spice blend.', image: '🍚', rating: 4.8, featured: false },
    { id: 'b-005', name: 'Beef Biryani', category: 'Biryani', price: 15.99, available: true, description: 'Tender beef cooked with basmati rice and warming spices.', image: '🍚', rating: 4.6, featured: false },
    { id: 'b-006', name: 'Prawns Biryani', category: 'Biryani', price: 17.99, available: true, description: 'Fresh prawns with fragrant rice and coastal flavors.', image: '🍚', rating: 4.7, featured: false },
    { id: 'b-007', name: 'Veg Biryani', category: 'Biryani', price: 10.99, available: true, description: 'Mixed vegetables with aromatic basmati rice and Indian spices.', image: '🍚', rating: 4.5, featured: false },
    // Kerala Specials
    { id: 'k-001', name: 'Porotta & Beef Curry', category: 'Kerala Specials', price: 13.99, available: true, description: 'Crispy layered porotta with rich Kerala beef curry.', image: '🥘', rating: 4.8, featured: true },
    { id: 'k-002', name: 'Kappa & Fish Curry', category: 'Kerala Specials', price: 12.99, available: true, description: 'Cassava fries with tangy Kerala fish curry.', image: '🐟', rating: 4.7, featured: false },
    { id: 'k-003', name: 'Appam & Chicken Stew', category: 'Kerala Specials', price: 11.99, available: true, description: 'Soft rice crepes with mild chicken stew.', image: '🥯', rating: 4.6, featured: false },
    { id: 'k-004', name: 'Puttu & Kadala Curry', category: 'Kerala Specials', price: 9.99, available: true, description: 'Cylindrical steamed cake with chickpea curry.', image: '🍲', rating: 4.5, featured: false },
    { id: 'k-005', name: 'Kerala Meals', category: 'Kerala Specials', price: 14.99, available: true, description: 'Complete Kerala meal with multiple curries and rice.', image: '🍛', rating: 4.8, featured: false },
    { id: 'k-006', name: 'Fish Molee', category: 'Kerala Specials', price: 13.99, available: true, description: 'Tender fish in coconut cream sauce with spices.', image: '🐟', rating: 4.7, featured: false },
    { id: 'k-007', name: 'Thalassery Biryani', category: 'Kerala Specials', price: 14.99, available: true, description: 'Thalassery-style biryani with unique spice blend.', image: '🍚', rating: 4.8, featured: false },
    // South Indian
    { id: 's-001', name: 'Masala Dosa', category: 'South Indian', price: 8.99, available: true, description: 'Crispy crepe filled with spiced potato and served with sambar.', image: '🥙', rating: 4.7, featured: true },
    { id: 's-002', name: 'Plain Dosa', category: 'South Indian', price: 6.99, available: true, description: 'Classic crispy crepe served with chutney and sambar.', image: '🥙', rating: 4.5, featured: false },
    { id: 's-003', name: 'Ghee Roast', category: 'South Indian', price: 7.99, available: true, description: 'Dosa roasted with clarified butter until crispy.', image: '🥙', rating: 4.6, featured: false },
    { id: 's-004', name: 'Mysore Masala Dosa', category: 'South Indian', price: 9.99, available: true, description: 'Spiced dosa with red chutney spread inside.', image: '🥙', rating: 4.8, featured: false },
    { id: 's-005', name: 'Idli Sambar', category: 'South Indian', price: 7.99, available: true, description: 'Soft steamed rice cakes with lentil vegetable stew.', image: '🍚', rating: 4.6, featured: false },
    { id: 's-006', name: 'Vada', category: 'South Indian', price: 5.99, available: true, description: 'Crispy fried lentil donuts served with sambar.', image: '🍩', rating: 4.5, featured: false },
    { id: 's-007', name: 'Pongal', category: 'South Indian', price: 8.99, available: true, description: 'Rice and lentil porridge tempered with pepper and cumin.', image: '🍲', rating: 4.6, featured: false },
    { id: 's-008', name: 'Uttapam', category: 'South Indian', price: 7.99, available: true, description: 'Savory rice pancake topped with onions and tomatoes.', image: '🥞', rating: 4.5, featured: false },
    // North Indian
    { id: 'n-001', name: 'Butter Chicken', category: 'North Indian', price: 13.99, available: true, description: 'Tender chicken in creamy tomato butter sauce.', image: '🍗', rating: 4.9, featured: true },
    { id: 'n-002', name: 'Chicken Tikka Masala', category: 'North Indian', price: 14.99, available: true, description: 'Tandoori chicken in aromatic creamy curry.', image: '🍗', rating: 4.8, featured: true },
    { id: 'n-003', name: 'Paneer Butter Masala', category: 'North Indian', price: 12.99, available: true, description: 'Cottage cheese cubes in rich tomato cream sauce.', image: '🧀', rating: 4.7, featured: false },
    { id: 'n-004', name: 'Palak Paneer', category: 'North Indian', price: 11.99, available: true, description: 'Spinach puree with cottage cheese.', image: '🥬', rating: 4.6, featured: false },
    { id: 'n-005', name: 'Kadai Chicken', category: 'North Indian', price: 12.99, available: true, description: 'Chicken cooked with peppers and onions in tomato base.', image: '🍗', rating: 4.7, featured: false },
    { id: 'n-006', name: 'Dal Makhani', category: 'North Indian', price: 10.99, available: true, description: 'Black lentils cooked overnight with cream and butter.', image: '🍲', rating: 4.8, featured: false },
    { id: 'n-007', name: 'Chole Bhature', category: 'North Indian', price: 9.99, available: true, description: 'Fluffy fried bread with spiced chickpea curry.', image: '🥖', rating: 4.6, featured: false },
    // Chinese & Indo-Chinese
    { id: 'ic-001', name: 'Chicken Fried Rice', category: 'Chinese & Indo-Chinese', price: 9.99, available: true, description: 'Rice stir-fried with chicken and vegetables.', image: '🍚', rating: 4.5, featured: false },
    { id: 'ic-002', name: 'Veg Fried Rice', category: 'Chinese & Indo-Chinese', price: 8.99, available: true, description: 'Mixed vegetables stir-fried with rice.', image: '🍚', rating: 4.4, featured: false },
    { id: 'ic-003', name: 'Schezwan Fried Rice', category: 'Chinese & Indo-Chinese', price: 10.99, available: true, description: 'Spicy fried rice with Schezwan sauce and vegetables.', image: '🌶️', rating: 4.6, featured: false },
    { id: 'ic-004', name: 'Chicken Noodles', category: 'Chinese & Indo-Chinese', price: 9.99, available: true, description: 'Stir-fried noodles with tender chicken.', image: '🍜', rating: 4.5, featured: false },
    { id: 'ic-005', name: 'Hakka Noodles', category: 'Chinese & Indo-Chinese', price: 8.99, available: true, description: 'Hakka-style noodles with vegetables.', image: '🍜', rating: 4.4, featured: false },
    { id: 'ic-006', name: 'Gobi Manchurian', category: 'Chinese & Indo-Chinese', price: 10.99, available: true, description: 'Cauliflower florets in tangy Manchurian sauce.', image: '🥦', rating: 4.6, featured: false },
    { id: 'ic-007', name: 'Chicken Manchurian', category: 'Chinese & Indo-Chinese', price: 11.99, available: true, description: 'Crispy chicken balls in tangy Manchurian sauce.', image: '🍗', rating: 4.7, featured: false },
    // Starters
    { id: 'st-001', name: 'Chicken 65', category: 'Starters', price: 8.99, available: true, description: 'Spicy fried chicken pieces with aromatic spices.', image: '🍗', rating: 4.7, featured: true },
    { id: 'st-002', name: 'Chicken Lollipop', category: 'Starters', price: 9.99, available: true, description: 'Chicken wings with meat lollipop style, spiced and fried.', image: '🍗', rating: 4.6, featured: false },
    { id: 'st-003', name: 'Dragon Chicken', category: 'Starters', price: 10.99, available: true, description: 'Indo-Chinese style spicy fried chicken.', image: '🍗', rating: 4.6, featured: false },
    { id: 'st-004', name: 'Paneer Tikka', category: 'Starters', price: 9.99, available: true, description: 'Marinated cottage cheese grilled on skewers.', image: '🧀', rating: 4.7, featured: false },
    { id: 'st-005', name: 'Tandoori Chicken', category: 'Starters', price: 11.99, available: true, description: 'Half chicken marinated and roasted in tandoor.', image: '🍗', rating: 4.8, featured: false },
    { id: 'st-006', name: 'Fish Fry', category: 'Starters', price: 10.99, available: true, description: 'Marinated fish fried until crispy.', image: '🐟', rating: 4.6, featured: false },
    { id: 'st-007', name: 'Prawn Fry', category: 'Starters', price: 11.99, available: true, description: 'Crispy fried prawns with aromatic spices.', image: '🦐', rating: 4.7, featured: false },
    // Seafood
    { id: 'sf-001', name: 'Fish Curry', category: 'Seafood', price: 12.99, available: true, description: 'Fresh fish in aromatic coconut or tomato curry.', image: '🐟', rating: 4.7, featured: false },
    { id: 'sf-002', name: 'Prawn Roast', category: 'Seafood', price: 14.99, available: true, description: 'Prawns roasted with aromatic spices.', image: '🦐', rating: 4.7, featured: false },
    { id: 'sf-003', name: 'Crab Masala', category: 'Seafood', price: 16.99, available: true, description: 'Fresh crab cooked in spiced gravy.', image: '🦀', rating: 4.8, featured: false },
    { id: 'sf-004', name: 'Squid Roast', category: 'Seafood', price: 13.99, available: true, description: 'Tender squid roasted with onions and spices.', image: '🦑', rating: 4.6, featured: false },
    { id: 'sf-005', name: 'Fish Fry (Seafood)', category: 'Seafood', price: 11.99, available: true, description: 'Marinated fish fried until crispy and golden.', image: '🐟', rating: 4.6, featured: false },
    // Vegetarian
    { id: 'v-001', name: 'Veg Kurma', category: 'Vegetarian', price: 9.99, available: true, description: 'Mixed vegetables in creamy coconut sauce.', image: '🥘', rating: 4.5, featured: false },
    { id: 'v-002', name: 'Mushroom Masala', category: 'Vegetarian', price: 10.99, available: true, description: 'Fresh mushrooms in aromatic tomato gravy.', image: '🍄', rating: 4.6, featured: false },
    { id: 'v-003', name: 'Aloo Gobi', category: 'Vegetarian', price: 8.99, available: true, description: 'Potato and cauliflower stir-fried with spices.', image: '🥔', rating: 4.5, featured: false },
    { id: 'v-004', name: 'Veg Kolhapuri', category: 'Vegetarian', price: 9.99, available: true, description: 'Vegetables in Kolhapuri-style spicy gravy.', image: '🌶️', rating: 4.6, featured: false },
    { id: 'v-005', name: 'Paneer Tikka Masala', category: 'Vegetarian', price: 11.99, available: true, description: 'Grilled paneer in creamy tomato curry.', image: '🧀', rating: 4.7, featured: false },
    // Bread
    { id: 'br-001', name: 'Kerala Porotta', category: 'Bread', price: 2.99, available: true, description: 'Flaky, layered paratha from Kerala.', image: '🥖', rating: 4.6, featured: false },
    { id: 'br-002', name: 'Butter Naan', category: 'Bread', price: 2.99, available: true, description: 'Soft naan bread brushed with butter.', image: '🥖', rating: 4.5, featured: false },
    { id: 'br-003', name: 'Garlic Naan', category: 'Bread', price: 3.49, available: true, description: 'Naan topped with garlic and herbs.', image: '🥖', rating: 4.6, featured: false },
    { id: 'br-004', name: 'Tandoori Roti', category: 'Bread', price: 1.99, available: true, description: 'Whole wheat bread roasted in tandoor.', image: '🥖', rating: 4.4, featured: false },
    { id: 'br-005', name: 'Chapati', category: 'Bread', price: 1.49, available: true, description: 'Simple Indian flatbread.', image: '🥖', rating: 4.3, featured: false },
    // Desserts
    { id: 'd-001', name: 'Gulab Jamun', category: 'Desserts', price: 4.99, available: true, description: 'Soft milk solids in rose-flavored sugar syrup.', image: '🍯', rating: 4.7, featured: false },
    { id: 'd-002', name: 'Rasmalai', category: 'Desserts', price: 5.99, available: true, description: 'Soft cheese balls in creamy sweetened milk.', image: '🥛', rating: 4.8, featured: false },
    { id: 'd-003', name: 'Payasam', category: 'Desserts', price: 5.99, available: true, description: 'Kerala-style sweet rice pudding.', image: '🍮', rating: 4.7, featured: false },
    { id: 'd-004', name: 'Carrot Halwa', category: 'Desserts', price: 4.99, available: true, description: 'Grated carrots cooked in milk and ghee.', image: '🥕', rating: 4.6, featured: false },
    { id: 'd-005', name: 'Kulfi', category: 'Desserts', price: 3.99, available: true, description: 'Traditional Indian frozen dessert.', image: '🍦', rating: 4.6, featured: false },
    { id: 'd-006', name: 'Falooda', category: 'Desserts', price: 4.99, available: true, description: 'Chilled dessert with noodles, cream, and falsa.', image: '🍨', rating: 4.7, featured: false },
    // Beverages
    { id: 'be-001', name: 'Lime Juice', category: 'Beverages', price: 2.99, available: true, description: 'Fresh lime juice with water and sugar.', image: '🍋', rating: 4.4, featured: false },
    { id: 'be-002', name: 'Mint Lime', category: 'Beverages', price: 3.49, available: true, description: 'Refreshing lime juice with fresh mint.', image: '🌿', rating: 4.5, featured: false },
    { id: 'be-003', name: 'Watermelon Juice', category: 'Beverages', price: 3.99, available: true, description: 'Fresh watermelon juice.', image: '🍉', rating: 4.5, featured: false },
    { id: 'be-004', name: 'Mango Shake', category: 'Beverages', price: 4.49, available: true, description: 'Creamy mango shake with milk.', image: '🥭', rating: 4.6, featured: false },
    { id: 'be-005', name: 'Tea', category: 'Beverages', price: 1.99, available: true, description: 'Hot Indian chai.', image: '☕', rating: 4.3, featured: false },
    { id: 'be-006', name: 'Coffee', category: 'Beverages', price: 2.49, available: true, description: 'Hot coffee.', image: '☕', rating: 4.4, featured: false },
    { id: 'be-007', name: 'Badam Milk', category: 'Beverages', price: 3.99, available: true, description: 'Almond milk shake with spices.', image: '🥛', rating: 4.5, featured: false },
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
    const [reservations, setReservations] = useState(storedState?.reservations ?? []);
    const [reviews, setReviews] = useState(storedState?.reviews ?? []);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Menu
                const fetchedMenu = await fetchMenu();
                if (fetchedMenu && fetchedMenu.length > 0) {
                    setMenuItems(fetchedMenu);
                }
            } catch (err) {
                console.error('Error fetching menu:', err);
            }

            if (user) {
                try {
                    // Fetch Orders based on Role
                    let fetchedOrders = [];
                    if (user.role === 'admin' || user.role === 'staff') {
                        fetchedOrders = await getAllOrders();
                    } else if (user.role === 'customer') {
                        fetchedOrders = await getCustomerOrders(user._id);
                    }
                    
                    if (fetchedOrders) {
                        setOrders(fetchedOrders);
                    }
                } catch (err) {
                    console.error('Error fetching orders:', err);
                }
            }
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

    const totalRevenue = useMemo(
        () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
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

        const statusSequence = ['received', 'preparing', 'ready', 'completed'];
        const currentStatus = order.orderStatus || order.status;
        const nextIndex = Math.min(statusSequence.indexOf(currentStatus) + 1, statusSequence.length - 1);
        const nextStatus = statusSequence[nextIndex];

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

    const addMenuItem = ({ name, category, price, description }) => {
        const nextItem = {
            id: `m-${Date.now()}`,
            name,
            category,
            price: parseFloat(price) || 0,
            available: true,
            description,
        };

        setMenuItems((current) => [nextItem, ...current]);
        showToast(`${name} added to the menu.`, 'success');
    };

    const addReservation = ({ name, time, guests, notes }) => {
        const nextReservation = {
            id: `R-${Date.now()}`,
            name,
            time,
            guests: Number(guests) || 2,
            status: 'confirmed',
            notes,
        };

        setReservations((current) => [nextReservation, ...current]);
        showToast('Reservation confirmed.', 'success');
    };

    const updateReservationStatus = (reservationId, nextStatus) => {
        setReservations((current) =>
            current.map((reservation) =>
                reservation.id === reservationId ? { ...reservation, status: nextStatus } : reservation
            )
        );
    };

    const cancelReservation = (reservationId) => {
        setReservations((current) =>
            current.map((reservation) =>
                reservation.id === reservationId ? { ...reservation, status: 'cancelled' } : reservation
            )
        );
        showToast('Reservation cancelled.', 'warning');
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
            searchQuery,
            setSearchQuery,
            filteredMenuItems,
            cartTotal,
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
            addReservation,
            updateReservationStatus,
            cancelReservation,
        }),
        [
            menuItems,
            cartItems,
            orders,
            reservations,
            reviews,
            searchQuery,
            filteredMenuItems,
            cartTotal,
            totalRevenue,
            topDishes,
        ]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
