const finnhub = require("./finnhubService.js");
const coingecko = require("./coingeckoService.js");
let yahoo = require("./yahooFinanceService.js")

async function getQuote(asset) {
    switch (asset.asset_class) {
        case "Crypto":
            return coingecko.getQuote(asset.external_id);

        case "Equity":
        case "ETF":
            return finnhub.getQuote(asset.ticker);

        default:
            throw new Error("Unsupported asset class");
    }
}

async function getHistoricalData(asset, range, interval) {
    switch (asset.asset_class) {

        case "Crypto":
            return coingecko.getHistoricalData(asset.external_id);

        case "Equity":
        
        case "ETF":
            return yahoo.getHistoricalData(asset.yahoo_symbol || asset.ticker, range, interval)

        case "Index":
            return yahoo.getHistoricalData(asset.yahoo_symbol, "1mo", "1d");

        default:
            throw new Error("Unsupported asset class");
    }
}

module.exports = { getQuote, getHistoricalData };