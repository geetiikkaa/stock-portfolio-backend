require("dotenv").config()
let express = require("express");
let app = express();
let cors = require("cors");
let router = require("./routers/authRoutes");
let path = require("path");
let assetRouter = require("./routers/assetRoutes");
let transactionRouter = require("./routers/transactionRoutes");
let watchlistRouter = require("./routers/watchlistRoutes");
let marketRouter = require("./routers/marketRoutes");
let portfolioRouter = require("./routers/portfolioRoutes");
require("./config/db")

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.listen(8000, () => {
    console.log("Server running on port 8000.");
})
app.use("/userProfile", express.static(path.join(__dirname, "userProfile")));
app.use("/api/auth", router);
app.use("/api/assets", assetRouter)
app.use("/api/transactions", transactionRouter)
app.use("/api/watchlistItems", watchlistRouter)
app.use("/api/market", marketRouter)
app.use("/api/portfolio", portfolioRouter)