let mongoose = require("mongoose")

let watchlistItemSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    asset_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    },
    favourite: {
        type: Boolean,
        required: true,
        default: false
    },
    trending: {
        type: Boolean,
        required: true,
        default: false
    },
    added_at: {
        type: Date,
    }
}, { timestamps: true })

module.exports = mongoose.model("WatchlistItem", watchlistItemSchema)