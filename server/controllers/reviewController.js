const Review = require('../models/Review');

const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.create({
            customer: req.user._id,
            rating,
            comment,
        });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

const getReviews = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.customerId) {
            filter.customer = req.query.customerId;
        }

        const reviews = await Review.find(filter).populate('customer', 'name email').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addReview,
    getReviews,
};
