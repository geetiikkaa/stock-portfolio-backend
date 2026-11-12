const { buildPortfolio } = require("../service/portfolioService");

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await buildPortfolio(req.user.id);

        return res.status(200).json({
            success: true,
            data: portfolio,
        });

    } catch (err) {
        console.error("Failed to fetch portfolio:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio.",
        });
    }
};

module.exports = {
    getPortfolio,
};