const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const searchCoins = async (query) => {
    const response = await fetch(
        `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to search cryptocurrencies.");
    }

    const data = await response.json();

    return data.coins.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        thumb: coin.thumb,
        marketCapRank: coin.market_cap_rank,
    }));
};

const getQuote = async (coinId) => {
    const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${encodeURIComponent(
            coinId
        )}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch crypto quote.");
    }

    const data = await response.json();

    if (!data[coinId]) {
        throw new Error("Cryptocurrency not found.");
    }

    const coin = data[coinId];
    const currentPrice = coin.usd;
    const percentChange = coin.usd_24h_change;
    // Approximate price 24 hours ago
    const referencePrice =
        percentChange != null
            ? currentPrice / (1 + percentChange / 100)
            : null;

    return {
        currentPrice,
        // For crypto this means approximately 24h ago,
        // not a traditional market "previous close".
        referencePrice,
        change:
            referencePrice != null
                ? currentPrice - referencePrice
                : null,
        percentChange,
        high: null,
        low: null,
        open: null,
        volume: coin.usd_24h_vol,
        timestamp: coin.last_updated_at,
    };
};

const getHistoricalData = async (coinId, days = 30) => {
    const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(
            coinId
        )}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch historical crypto data.");
    }

    return await response.json();
};

const getCoinProfile = async (coinId) => {
    const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(
            coinId
        )}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch crypto profile.");
    }

    const data = await response.json();

    return {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image.large,
        description: data.description.en,
        marketCap: data.market_data.market_cap.usd,
        circulatingSupply: data.market_data.circulating_supply,
        totalSupply: data.market_data.total_supply,
        maxSupply: data.market_data.max_supply,
        homepage: data.links.homepage[0],
    };
};

module.exports = {
    searchCoins,
    getQuote,
    getHistoricalData,
    getCoinProfile,
};

