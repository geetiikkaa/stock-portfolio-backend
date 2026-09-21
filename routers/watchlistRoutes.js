let express = require("express")
let watchlistRouter = express.Router()
let {
    getWatchlist,
    addWatchlistItem,
    updateWatchlistItem,
    deleteWatchlistItem,
} = require("../controllers/watchlistController")
let verifyToken = require("../middlewares/authMiddleware")

watchlistRouter.use(verifyToken)
watchlistRouter.get("/", getWatchlist)
watchlistRouter.post("/", addWatchlistItem)
watchlistRouter.put("/:id", updateWatchlistItem)
watchlistRouter.delete("/:id", deleteWatchlistItem)

module.exports = watchlistRouter