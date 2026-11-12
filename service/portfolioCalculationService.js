
const marketData = require("../service");

const calculatePortfolioHoldings = async (holdings) => {
    const quotes = await Promise.allSettled(
        holdings.map((holding) =>
            marketData.getQuote(holding.asset)
        )
    );

    return holdings.map((holding, index) => {
        const quote = quotes[index];

        const currentPrice =
            quote.status === "fulfilled"
                ? quote.value.currentPrice
                : holding.averageBuyPrice;

        const referencePrice =
            quote.status === "fulfilled"
                ? quote.value.referencePrice
                : currentPrice;

        const todayProfitLoss =
            holding.quantity * (currentPrice - referencePrice);

        const referenceValue =
            holding.quantity * referencePrice;

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
            todayProfitLossPercent: Number(
                todayProfitLossPercent.toFixed(2)
            ),

            referenceValue: Number(referenceValue.toFixed(2)),
        };
    });
};

module.exports = {
    calculatePortfolioHoldings,
};
