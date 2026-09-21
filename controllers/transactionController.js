let Transaction = require("../models/transactionSchema");
let Asset = require("../models/assetSchema")

let getAllTransactions = async (req, res) => {
    try {
        let transactions = await Transaction.find({
            user_id: req.user.id,
        })
            .populate("asset_id")
            .sort({ occurred_at: -1 });

        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let getTransactionById = async (req, res) => {
    try {
        let transaction = await Transaction.findOne({
            _id: req.params.id,
            user_id: req.user.id,
        }).populate("asset_id");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            transaction,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let createTransaction = async (req, res) => {
    try {
        const {
            asset_id,
            type,
            quantity,
            amount,
            price_per_unit,
            status,
            occurred_at,
        } = req.body;

        const asset = await Asset.findById(asset_id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        if (type === "Sell") {
            const transactions = await Transaction.find({
                user_id: req.user.id,
                asset_id,
            });

            let currentHolding = 0;

            for (const tx of transactions) {
                if (tx.type === "Buy") {
                    currentHolding += tx.quantity;
                } else if (tx.type === "Sell") {
                    currentHolding -= tx.quantity;
                }
            }

            if (quantity > currentHolding) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot sell ${quantity} units. You only own ${currentHolding}.`,
                });
            }
        }

        const transaction = await Transaction.create({
            user_id: req.user.id,
            asset_id: asset._id,
            ticker_snapshot: asset.ticker,
            type,
            quantity,
            amount,
            price_per_unit,
            status,
            occurred_at,
        });

        res.status(201).json({
            success: true,
            transaction,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findOneAndUpdate(
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

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            transaction,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let deleteTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};