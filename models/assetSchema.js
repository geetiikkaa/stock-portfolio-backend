let mongoose = require("mongoose")

let assetSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    asset_class: {
        type: String,
        enum: ['All', 'Equity', 'Mutual Funds', 'Crypto', 'Cash'],
        required: true
    },
    external_id: {
        type: String,
    },
    yahoo_symbol: {
        type: String,
        unique: true,
        sparse: true
    },
    isMarketTracked: {
        type: Boolean
    },
    unitLabel: {
        type: String,
        require: true,
        default: "units"
    }
})

module.exports = mongoose.model("Asset", assetSchema)