const { buildPortfolio } = require("../service/portfolioService");

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await buildPortfolio(req.user.id);

        res.status(200).json({
            success: true,
            data: portfolio,
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
    getPortfolio,
};