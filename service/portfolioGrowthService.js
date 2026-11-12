
const yahoo = require("./yahooFinanceService");
const Transaction = require("../models/transactionSchema");
const marketData = require("../service");

const RANGE_MAP = {
    "1M": { range: "1mo", interval: "1d" },
    "3M": { range: "3mo", interval: "1d" },
    "6M": { range: "6mo", interval: "1d" },
    "1Y": { range: "1y", interval: "1d" },
    "All": { range: "5y", interval: "1wk" },
};
const DASHBOARD_RANGE_MAP = {
    "Today": { range: "1d", interval: "5m" },
    "This Week": { range: "5d", interval: "15m" },
    "This Month": { range: "1mo", interval: "1d" },
    "This Year": { range: "1y", interval: "1d" },
    "All Time": { range: "5y", interval: "1wk" },
};

const getNiftyGrowth = async (rangeKey = "1Y") => {
    const mapped = RANGE_MAP[rangeKey];

    if (!mapped) {
        const error = new Error(
            "Invalid range. Use 1M, 3M, 6M, 1Y, or All."
        );
        error.statusCode = 400;
        throw error;
    }

    const raw = await yahoo.getHistoricalData(
        "^NSEI",
        mapped.range,
        mapped.interval
    );

    if (!raw || raw.length === 0) {
        const error = new Error("No NIFTY 50 data returned.");
        error.statusCode = 404;
        throw error;
    }

    const basePrice = raw[0].value;

    const niftyHistory = raw.map((item) => ({
        date: item.timestamp,
        nifty:
            basePrice === 0
                ? 0
                : Number(
                    (
                        ((item.value - basePrice) / basePrice) * 100
                    ).toFixed(2)
                ),
    }));

    return niftyHistory;
};

const getPortfolioHistory = async (userId, rangeKey = "This Year") => {
    const mapped =
        RANGE_MAP[rangeKey] || DASHBOARD_RANGE_MAP[rangeKey];
    if (!mapped) {
        throw new Error("Invalid portfolio growth range.");
    }

    const transactions = await Transaction.find({
        user_id: userId,
        status: "Completed",
    })
        .populate(
            "asset_id",
            "name asset_class ticker external_id currency yahoo_symbol"
        )
        .sort({ occurred_at: 1 });

    // Group transactions by asset.
    const assetMap = new Map();

    for (const tx of transactions) {
        if (!tx.asset_id) continue;

        const id = tx.asset_id._id.toString();

        if (!assetMap.has(id)) {
            assetMap.set(id, {
                asset: tx.asset_id,
                transactions: [],
            });
        }

        assetMap.get(id).transactions.push(tx);
    }

    // Fetch historical prices for each asset.
    const assetStates = await Promise.all(
        [...assetMap.values()].map(async (item) => {
            try {
                const history = await marketData.getHistoricalData(
                    item.asset,
                    mapped.range,
                    mapped.interval
                );

                return {
                    ...item,
                    history: history || [],
                    txIndex: 0,
                    priceIndex: 0,
                    quantity: 0,
                    currentPrice: null,
                };
            } catch (error) {
                console.error(
                    `Failed to fetch history for ${item.asset.ticker}:`,
                    error.message
                );

                return {
                    ...item,
                    history: [],
                    txIndex: 0,
                    priceIndex: 0,
                    quantity: 0,
                    currentPrice: null,
                };
            }
        })
    );

    // Use all available historical dates.
    const dates = [
        ...new Set(
            assetStates.flatMap((state) =>
                state.history.map((item) =>
                    new Date(item.timestamp).getTime()
                )
            )
        ),
    ].sort((a, b) => a - b);

    const portfolioHistory = [];

    for (const date of dates) {
        let totalValue = 0;

        for (const state of assetStates) {
            // Apply transactions up to this date.
            while (
                state.txIndex < state.transactions.length &&
                new Date(
                    state.transactions[state.txIndex].occurred_at
                ).getTime() <= date
            ) {
                const tx = state.transactions[state.txIndex];

                if (tx.type === "Buy") {
                    state.quantity += tx.quantity || 0;
                } else if (tx.type === "Sell") {
                    state.quantity -= tx.quantity || 0;
                }

                state.txIndex++;
            }

            // Find latest available price up to this date.
            while (
                state.priceIndex < state.history.length &&
                new Date(
                    state.history[state.priceIndex].timestamp
                ).getTime() <= date
            ) {
                state.currentPrice =
                    state.history[state.priceIndex].value;

                state.priceIndex++;
            }

            if (
                state.quantity > 0 &&
                state.currentPrice != null
            ) {
                totalValue +=
                    state.quantity * state.currentPrice;
            }
        }

        portfolioHistory.push({
            date: new Date(date).toISOString(),
            value: Number(totalValue.toFixed(2)),
        });
    }

    // Remove dates before the portfolio first had a positive value
    const firstValidIndex = portfolioHistory.findIndex(
        (item) => item.value > 0
    );
    const validHistory =
        firstValidIndex === -1
            ? []
            : portfolioHistory.slice(firstValidIndex);

    return validHistory;
};

module.exports = { getNiftyGrowth, getPortfolioHistory, RANGE_MAP, DASHBOARD_RANGE_MAP };
