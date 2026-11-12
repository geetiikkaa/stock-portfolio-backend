
const calculatePortfolioSummary = (portfolioHoldings) => {
    const summary = portfolioHoldings.reduce(
        (acc, holding) => {
            acc.totalInvestment += holding.invested;
            acc.currentValue += holding.currentValue;
            acc.totalProfitLoss += holding.profitLoss;
            acc.todayProfitLoss += holding.todayProfitLoss;
            acc.referenceValue += holding.referenceValue;

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
        summary.totalInvestment === 0
            ? 0
            : Number(
                (
                    (summary.totalProfitLoss / summary.totalInvestment) *
                    100
                ).toFixed(2)
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

    summary.totalInvestment = Number(
        summary.totalInvestment.toFixed(2)
    );

    summary.currentValue = Number(
        summary.currentValue.toFixed(2)
    );

    summary.totalProfitLoss = Number(
        summary.totalProfitLoss.toFixed(2)
    );

    summary.todayProfitLoss = Number(
        summary.todayProfitLoss.toFixed(2)
    );

    return summary;
};

module.exports = {
    calculatePortfolioSummary,
};
