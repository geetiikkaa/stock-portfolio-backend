
const { getUserHoldings } = require("./holdingsService");

const {
    calculatePortfolioHoldings,
} = require("./portfolioCalculationService");

const {
    calculatePortfolioSummary,
} = require("./portfolioSummaryService");

const buildPortfolio = async (userId) => {
    // Step 1: Get user's holdings from transactions
    const holdings = await getUserHoldings(userId);

    // Step 2: Calculate individual holding values and returns
    const portfolioHoldings =
        await calculatePortfolioHoldings(holdings);

    // Step 3: Calculate overall portfolio summary
    const summary =
        calculatePortfolioSummary(portfolioHoldings);

    return {
        summary,
        holdings: portfolioHoldings,
    };
};

module.exports = {
    buildPortfolio,
};
