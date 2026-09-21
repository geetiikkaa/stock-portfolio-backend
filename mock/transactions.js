const TRANSACTIONS = [
    {
        _id: "6879a1d2b4b8c20000000101",
        user_id: "6879a1d2b4b8c20000000001",
        asset_id: "6879a1d2b4b8c20000000011",
        ticker_snapshot: "AAPL",
        type: "Buy",
        status: "Completed",
        quantity: 10,
        price_per_unit: 2125,
        amount: 21250,
        occurred_at: new Date("2026-07-10T10:15:00")
    },

    {
        _id: "6879a1d2b4b8c20000000102",
        user_id: "6879a1d2b4b8c20000000001",
        asset_id: "6879a1d2b4b8c20000000012",
        ticker_snapshot: "RELIANCE",
        type: "Buy",
        status: "Completed",
        quantity: 5,
        price_per_unit: 2578,
        amount: 12890,
        occurred_at: new Date("2026-07-11T13:10:00")
    },

    {
        _id: "6879a1d2b4b8c20000000103",
        user_id: "6879a1d2b4b8c20000000011",
        asset_id: "6879a1d2b4b8c20000000011",
        ticker_snapshot: "AAPL",
        type: "Sell",
        status: "Completed",
        quantity: 2,
        price_per_unit: 2300,
        amount: 4600,
        occurred_at: new Date("2026-07-14T11:45:00")
    },

    {
        _id: "6879a1d2b4b8c20000000104",
        user_id: "6879a1d2b4b8c20000000001",
        asset_id: "6879a1d2b4b8c20000000013",
        ticker_snapshot: "BTC",
        type: "Buy",
        status: "Completed",
        quantity: 0.05,
        price_per_unit: 4300000,
        amount: 215000,
        occurred_at: new Date("2026-07-15T09:20:00")
    },

    {
        _id: "6879a1d2b4b8c20000000105",
        user_id: "6879a1d2b4b8c20000000001",
        asset_id: "6879a1d2b4b8c20000000015",
        ticker_snapshot: "CASH",
        type: "Deposit",
        status: "Completed",
        quantity: null,
        price_per_unit: null,
        amount: 5000,
        occurred_at: new Date("2026-07-16T16:30:00")
    },

    {
        _id: "6879a1d2b4b8c20000000106",
        user_id: "6879a1d2b4b8c20000000001",
        asset_id: "6879a1d2b4b8c20000000015",
        ticker_snapshot: "CASH",
        type: "Withdrawal",
        status: "Pending",
        quantity: null,
        price_per_unit: null,
        amount: 2000,
        occurred_at: new Date("2026-07-18T12:00:00")
    }
];

module.exports = TRANSACTIONS