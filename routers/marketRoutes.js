let express = require("express")
let { getMarketQuote, getMarketHistory, getMarketProfile, getMarketIndices, getMarketMovers, getMarketNews } = require("../controllers/marketController.js")
let marketRouter = express.Router()

marketRouter.get("/quote/:symbol", getMarketQuote)
marketRouter.get("/profile/:symbol", getMarketProfile)
marketRouter.get("/history/:symbol", getMarketHistory)
marketRouter.get("/indices", getMarketIndices)
marketRouter.get("/movers", getMarketMovers)
marketRouter.get("/news", getMarketNews)

module.exports = marketRouter