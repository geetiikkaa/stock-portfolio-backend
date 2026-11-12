const express = require("express");
const { getPortfolio } = require("../controllers/portfolioController");
const { getPortfolioGrowth } = require("../controllers/portfolioGrowthController");
const authMiddleware = require("../middlewares/authMiddleware");
const portfolioRouter = express.Router();

portfolioRouter.get("/", authMiddleware, getPortfolio);
portfolioRouter.get("/growth", authMiddleware, getPortfolioGrowth);

module.exports = portfolioRouter;