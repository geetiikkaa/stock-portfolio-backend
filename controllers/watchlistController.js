let WatchlistItem = require("../models/watchlistItemSchema");

let getWatchlist = async (req, res) => {
    try {
        let watchlist = await WatchlistItem.find({
            user_id: req.user.id,
        })
            .populate("asset_id")
            .sort({ added_at: -1 });

        res.status(200).json({
            success: true,
            watchlist,
        });
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let addWatchlistItem = async (req, res) => {
    try {
        let { asset_id, favourite = false, trending = false } = req.body;

        let existing = await WatchlistItem.findOne({
            user_id: req.user.id,
            asset_id,
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Asset already exists in watchlist",
            });
        }

        let watchlistItem = await WatchlistItem.create({
            user_id: req.user.id,
            asset_id,
            favourite,
            trending,
            added_at: new Date(),
        });

        res.status(201).json({
            success: true,
            watchlistItem,
        });
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let updateWatchlistItem = async (req, res) => {
    try {
        let watchlistItem = await WatchlistItem.findOneAndUpdate(
            {
                _id: req.params.id,
                user_id: req.user.id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!watchlistItem) {
            return res.status(404).json({
                success: false,
                message: "Watchlist item not found",
            });
        }

        res.status(200).json({
            success: true,
            watchlistItem,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let deleteWatchlistItem = async (req, res) => {
    try {
        let watchlistItem = await WatchlistItem.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.id,
        });

        if (!watchlistItem) {
            return res.status(404).json({
                success: false,
                message: "Watchlist item not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Removed from watchlist",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getWatchlist,
    addWatchlistItem,
    updateWatchlistItem,
    deleteWatchlistItem,
};