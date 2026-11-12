
const Transaction = require("../models/transactionSchema");

const getUserHoldings = async (userId) => {
    const transactions = await Transaction.find({
        user_id: userId,
        status: "Completed",
    })
        .populate("asset_id", "name asset_class ticker external_id currency")
        .sort({ occurred_at: 1 });

    const holdingsMap = new Map();

    for (const tx of transactions) {
        const assetKey = tx.asset_id._id.toString();

        if (!holdingsMap.has(assetKey)) {
            holdingsMap.set(assetKey, {
                assetId: tx.asset_id._id,
                asset: tx.asset_id,
                ticker: tx.ticker_snapshot,
                name: tx.asset_id.name,
                assetClass: tx.asset_id.asset_class,
                quantity: 0,
                totalCost: 0,
                averageBuyPrice: 0,
            });
        }

        const holding = holdingsMap.get(assetKey);

        if (tx.type === "Buy") {
            holding.totalCost += tx.quantity * tx.price_per_unit;
            holding.quantity += tx.quantity;

            holding.averageBuyPrice =
                holding.totalCost / holding.quantity;

        } else if (tx.type === "Sell") {
            holding.quantity -= tx.quantity;

            holding.totalCost -=
                tx.quantity * holding.averageBuyPrice;

            if (holding.quantity <= 0) {
                holding.quantity = 0;
                holding.totalCost = 0;
                holding.averageBuyPrice = 0;
            } else {
                holding.averageBuyPrice =
                    holding.totalCost / holding.quantity;
            }
        }
    }

    return [...holdingsMap.values()].filter(
        (holding) => holding.quantity > 0
    );
};

module.exports = {
    getUserHoldings,
};
