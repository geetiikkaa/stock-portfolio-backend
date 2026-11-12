const {
    getNiftyGrowth,
    getPortfolioHistory,
    DASHBOARD_RANGE_MAP,
} = require("../service/portfolioGrowthService");

const getPortfolioGrowth = async (req, res) => {
    try {
        const rangeKey = req.query.range || "1Y";
        const isDashboard = req.query.page === "dashboard";

        let portfolio;
        let nifty = [];

        if (isDashboard) {
            portfolio = await getPortfolioHistory(
                req.user.id,
                rangeKey,
                DASHBOARD_RANGE_MAP
            );
        } else {
            [nifty, portfolio] = await Promise.all([
                getNiftyGrowth(rangeKey),
                getPortfolioHistory(req.user.id, rangeKey),
            ]);
        }

        return res.status(200).json({
            success: true,
            data: {
                nifty,
                portfolio,
            },
        });

    } catch (err) {
        console.error("Failed to fetch portfolio growth:", err);

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getPortfolioGrowth,
};