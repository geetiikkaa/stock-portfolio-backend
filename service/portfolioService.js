const Transaction = require("../models/transactionSchema");
const { getQuote } = require("./finnhubService");
const marketData = require("../service");

const buildPortfolio = async (userId) => {
    const transactions = await Transaction.find({
        user_id: userId,
        status: "Completed",
    })
        .populate("asset_id", "name asset_class ticker external_id")
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
        }
        else if (tx.type === "Sell") {
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

    const holdings = [...holdingsMap.values()].filter((holding) => holding.quantity > 0);
    const quotes = await Promise.allSettled(holdings.map((holding) => marketData.getQuote(holding.asset)));
    const portfolioHoldings = holdings.map((holding, index) => {
        const quote = quotes[index];
        const currentPrice = quote.status === "fulfilled" ? quote.value.currentPrice : holding.averageBuyPrice
        const referencePrice =
            quote.status === "fulfilled"
                ? quote.value.referencePrice
                : currentPrice;
        const todayProfitLoss =
            holding.quantity * (currentPrice - referencePrice);
        let referenceValue = holding.quantity * referencePrice;
        const todayProfitLossPercent =
            referencePrice === 0
                ? 0
                : ((currentPrice - referencePrice) / referencePrice) * 100;
        const invested = holding.totalCost;
        const currentValue =
            holding.quantity * currentPrice;
        const profitLoss =
            currentValue - invested;
        const profitLossPercent =
            invested === 0
                ? 0
                : (profitLoss / invested) * 100;

        return {
            assetId: holding.assetId,
            ticker: holding.ticker,
            name: holding.name,
            assetClass: holding.assetClass,
            currency: holding.asset.currency,
            quantity: holding.quantity,
            buyPrice: Number(holding.averageBuyPrice.toFixed(2)),
            currentPrice,
            referencePrice,
            invested: Number(invested.toFixed(2)),
            currentValue: Number(currentValue.toFixed(2)),
            profitLoss: Number(profitLoss.toFixed(2)),
            profitLossPercent: Number(profitLossPercent.toFixed(2)),
            todayProfitLoss: Number(todayProfitLoss.toFixed(2)),
            referenceValue: Number(referenceValue.toFixed(2))
        };
    });

    const summary = portfolioHoldings.reduce(
        (acc, holding) => {
            acc.totalInvestment += holding.invested;
            acc.currentValue += holding.currentValue;
            acc.totalProfitLoss += holding.profitLoss;
            acc.todayProfitLoss += holding.todayProfitLoss;
            acc.referenceValue += holding.referenceValue

            return acc;
        },
        {
            totalInvestment: 0,
            currentValue: 0,
            totalProfitLoss: 0,
            todayProfitLoss: 0,
            referenceValue: 0,
        }
    );

    summary.positions = portfolioHoldings.length;
    summary.totalProfitPercent =
        summary.totalInvestment === 0 ? 0 : Number(((summary.totalProfitLoss / summary.totalInvestment) * 100).toFixed(2));
    summary.totalInvestment = Number(summary.totalInvestment.toFixed(2));
    summary.currentValue = Number(summary.currentValue.toFixed(2));
    summary.totalProfitLoss = Number(summary.totalProfitLoss.toFixed(2));
    summary.todayProfitLoss = Number(
        summary.todayProfitLoss.toFixed(2)
    );
    summary.todayProfitLossPercent =
        summary.referenceValue === 0
            ? 0
            : Number(
                (
                    (summary.todayProfitLoss / summary.referenceValue) *
                    100
                ).toFixed(2)
            );

    return {
        summary,
        holdings: portfolioHoldings,
    };
};

module.exports = {
    buildPortfolio,
};