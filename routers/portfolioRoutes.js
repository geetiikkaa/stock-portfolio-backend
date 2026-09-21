const express = require("express");
const { getPortfolio } = require("../controllers/portfolioController");
const authMiddleware = require("../middlewares/authMiddleware");
const portfolioRouter = express.Router();

portfolioRouter.get("/", authMiddleware, getPortfolio);

module.exports = portfolioRouter;