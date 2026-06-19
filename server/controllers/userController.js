const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist').select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.avatar = req.body.avatar || user.avatar;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                addresses: updatedUser.addresses,
                wishlist: updatedUser.wishlist,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (req.body.isDefault) {
                user.addresses.forEach(a => a.isDefault = false);
            } else if (user.addresses.length === 0) {
                req.body.isDefault = true;
            }
            user.addresses.push(req.body);
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const address = user.addresses.id(req.params.id);
            if (address) {
                if (req.body.isDefault) {
                    user.addresses.forEach(a => a.isDefault = false);
                }
                address.street = req.body.street || address.street;
                address.city = req.body.city || address.city;
                address.state = req.body.state || address.state;
                address.zipCode = req.body.zipCode || address.zipCode;
                address.country = req.body.country || address.country;
                if (req.body.isDefault !== undefined) address.isDefault = req.body.isDefault;
                
                await user.save();
                res.json(user.addresses);
            } else {
                res.status(404).json({ message: 'Address not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
            if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
                user.addresses[0].isDefault = true;
            }
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const menuItemId = req.params.menuId;
            const index = user.wishlist.indexOf(menuItemId);
            if (index > -1) {
                user.wishlist.splice(index, 1);
            } else {
                user.wishlist.push(menuItemId);
            }
            await user.save();
            await user.populate('wishlist');
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin route
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    removeAddress,
    toggleWishlist,
    getAllUsers,
    updateUserRole
};
