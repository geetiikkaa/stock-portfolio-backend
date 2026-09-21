let mongoose = require("mongoose")

let transactionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    asset_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    ticker_snapshot: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    quantity: {
        type: Number
    },
    amount: {
        type: Number
    },
    price_per_unit: {
        type: Number
    },
    occurred_at: {
        type: Date
    }
}, { timestamps: true })

module.exports = mongoose.model("Transaction", transactionSchema)