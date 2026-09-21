const Asset = require("../models/assetSchema");
const marketData = require("../service");
const finnhub = require("../service/finnhubService");
let yahoo = require("../service/yahooFinanceService")
let symbols = require("../constants/marketSymbols")

const getMarketQuote = async (req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Symbol is required.",
            });
        }

        const asset = await Asset.findOne({
            $or: [
                { ticker: symbol.trim().toUpperCase() },
                { external_id: symbol.trim().toLowerCase() }
            ]
        });

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        const quote = await marketData.getQuote(asset);

        return res.status(200).json({
            success: true,
            data: quote,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMarketHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { range = "1d", interval = "5m" } = req.query;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Symbol is required.",
            });
        }

        const asset = await Asset.findOne({
            $or: [
                { ticker: symbol.trim().toUpperCase() },
                { external_id: symbol.trim().toLowerCase() },
            ],
        });

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        const history = await marketData.getHistoricalData(asset, range, interval);

        return res.status(200).json({
            success: true,
            data: history,
        });
    } catch (error) {
        console.error("Error fetching market history:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMarketProfile = async (req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Symbol is required.",
            });
        }

        // Company profiles are only available for stocks/ETFs.
        const profile = await finnhub.getCompanyProfile(symbol);

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Error fetching company profile:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMarketIndices = async (req, res) => {
    try {
        const symbols = [
            "^NSEI",
            "^BSESN",
            "^IXIC",
            "^GSPC",
        ];

        const data = await Promise.all(
            symbols.map(symbol => yahoo.getQuote(symbol))
        );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching market indices:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMarketMovers = async (req, res) => {
    try {
        const assets = await Asset.find({
            asset_class: "Equity",
            isMarketTracked: true,
        }).select("ticker name yahoo_symbol");
        const quotes = await yahoo.getQuotes(
            assets.map((asset) => asset.yahoo_symbol).filter(Boolean)
        );
        const validQuotes = quotes.filter(
            (quote) =>
                typeof quote.currentPrice === "number" &&
                typeof quote.percentChange === "number"
        );
        const gainers = [...validQuotes]
            .filter((quote) => quote.percentChange > 0)
            .sort((a, b) => b.percentChange - a.percentChange)
            .slice(0, 20);
        const losers = [...validQuotes]
            .filter((quote) => quote.percentChange < 0)
            .sort((a, b) => a.percentChange - b.percentChange)
            .slice(0, 20);

        return res.status(200).json({
            success: true,
            data: {
                gainers,
                losers,
            },
        });
    } catch (error) {
        console.error("Error fetching market movers:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMarketNews = async (req, res) => {
    try {
        const news = await finnhub.getMarketNews();

        const formattedNews = news
            .filter((item) => item.headline)
            .slice(0, 10)
            .map((item) => ({
                title: item.headline,
                source: item.source,
                time: item.datetime
                    ? new Date(item.datetime * 1000).toISOString()
                    : null,
                summary: item.summary,
                image: item.image,
                url: item.url,
            }));

        return res.status(200).json({
            success: true,
            data: formattedNews,
        });
    } catch (error) {
        console.error("Error fetching market news:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { getMarketQuote, getMarketHistory, getMarketProfile, getMarketIndices, getMarketMovers, getMarketNews };