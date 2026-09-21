const searchAssets = async (query) => {
    const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${process.env.FINNHUB_API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch assets from Finnhub");
    }

    const data = await response.json();

    return data.result.map((asset) => ({
        ticker: asset.symbol,
        name: asset.description,
        displaySymbol: asset.displaySymbol,
        type: asset.type,
    }));
};

module.exports = searchAssets