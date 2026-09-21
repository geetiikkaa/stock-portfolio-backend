let { formatDistanceToNow } = require("date-fns")
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
let FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

const getQuote = async (symbol) => {
    const response = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(
            symbol
        )}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch market quote.");
    }

    const data = await response.json();

    return {
        symbol,
        currentPrice: data.c,
        referencePrice: data.pc,
        change: data.d,
        percentChange: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        timestamp: data.t,
    };
};

const getHistoricalData = async (symbol) => {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60;

    const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Symbol:", symbol);
    console.log("Finnhub response:", data);

    if (!response.ok || data.s !== "ok") {
        throw new Error("Failed to fetch historical data");
    }

    return data.c.map((price, index) => ({
        time: data.t[index],
        value: price,
    }));
};

const getCompanyProfile = async (symbol) => {
    const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch company profile");
    }

    return await response.json();
};

const getMarketNews = async () => {
    const response = await fetch(
        `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch market news");
    }

    const data = await response.json();

    return data
};

module.exports = { getQuote, getHistoricalData, getCompanyProfile, getMarketNews }