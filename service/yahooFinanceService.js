const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const getQuote = async (symbol) => {
    const quote = await yahooFinance.quote(symbol);

    return {
        symbol: quote.symbol,
        name: quote.shortName,
        currentPrice: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        percentChange: quote.regularMarketChangePercent,
        currency: quote.currency,
        exchange: quote.fullExchangeName,
        timestamp: quote.regularMarketTime,
    };
};
const getQuotes = async (symbols) => {
    const quotes = await yahooFinance.quote(symbols);

    return quotes.map((quote) => ({
        symbol: quote.symbol,
        name: quote.shortName,
        currentPrice: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        percentChange: quote.regularMarketChangePercent,
        currency: quote.currency,
        exchange: quote.fullExchangeName,
        timestamp: quote.regularMarketTime,
    }));
};

const getPeriodStart = (range) => {
    const now = new Date();
    const start = new Date(now);

    switch (range) {
        case "1d":
            start.setDate(start.getDate() - 1);
            break;
        case "5d":
            start.setDate(start.getDate() - 5);
            break;
        case "1mo":
            start.setMonth(start.getMonth() - 1);
            break;
        case "3mo":
            start.setMonth(start.getMonth() - 3);
            break;
        case "6mo":
            start.setMonth(start.getMonth() - 6);
            break;
        case "1y":
            start.setFullYear(start.getFullYear() - 1);
            break;
        case "5y":
            start.setFullYear(start.getFullYear() - 5);
            break;
        default:
            throw new Error("Unsupported range");
    }

    return start;
};

const getHistoricalData = async (
    symbol,
    range = "1mo",
    interval = "1d"
) => {
    const result = await yahooFinance.chart(symbol, {
        period1: getPeriodStart(range),
        period2: new Date(),
        interval,
    });

    return result.quotes
        .filter(item => item.close != null)
        .map(item => ({
            timestamp: item.date,
            value: item.close,
        }));
};


module.exports = { getQuote, getQuotes, getHistoricalData };