const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const cache = new Map();

const getCachedData = async (key, ttl, fetcher) => {
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }

    const data = await fetcher();

    cache.set(key, {
        data,
        expiry: Date.now() + ttl,
    });

    return data;
};

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
    return getCachedData(`quote:${coinId}`, 60000, async () => {
        const response = await fetch(
            `${COINGECKO_BASE_URL}/simple/price?ids=${encodeURIComponent(
                coinId
            )}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`
        );

        if (!response.ok) {
            const errorBody = await response.text();

            console.error("CoinGecko quote error:", {
                status: response.status,
                body: errorBody,
                coinId,
            });

            throw new Error("Failed to fetch crypto quote.");
        }

        const data = await response.json();

        if (!data[coinId]) {
            throw new Error("Cryptocurrency not found.");
        }

        const coin = data[coinId];
        const currentPrice = coin.usd;
        const percentChange = coin.usd_24h_change;
        const referencePrice =
            percentChange != null
                ? currentPrice / (1 + percentChange / 100)
                : null;

        return {
            currentPrice,
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
    });
};



const getHistoricalData = async (coinId, range = "1mo") => {
    const rangeToDays = {
        "1mo": 30,
        "3mo": 90,
        "6mo": 180,
        "1y": 365,
        "5y": 1825,
    };

    const days = rangeToDays[range] || 30;

    return getCachedData(
        `history:${coinId}:${days}`,
        15 * 60 * 1000,
        async () => {
            const response = await fetch(
                `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(
                    coinId
                )}/market_chart?vs_currency=usd&days=${days}`
            );

            if (!response.ok) {
                const errorBody = await response.text();

                console.error("CoinGecko history error:", {
                    status: response.status,
                    body: errorBody,
                    coinId,
                    days,
                });

                const error = new Error(
                    "Failed to fetch historical crypto data."
                );

                error.statusCode = response.status;
                throw error;
            }

            const data = await response.json();

            return data.prices.map(([timestamp, price]) => ({
                timestamp,
                value: price,
            }));
        }
    );
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