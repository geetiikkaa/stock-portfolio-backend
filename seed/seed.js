require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/authSchema");
const Asset = require("../models/assetSchema");
const Transaction = require("../models/transactionSchema");
const WatchlistItem = require("../models/watchlistItemSchema");

const MONGO_URI = process.env.MONGO_DB_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");

        // -----------------------------------------------------
        // Get an existing user
        // -----------------------------------------------------

        const user = await User.findOne({ name: "Vansh Tyagi" });

        if (!user) {
            throw new Error(
                "No users found. Please register a user before running the seed script."
            );
        }

        console.log(`Using user: ${user.name} (${user.email})`);

        // -----------------------------------------------------
        // Clear old data
        // -----------------------------------------------------

        await Transaction.deleteMany({});
        await WatchlistItem.deleteMany({});
        await Asset.deleteMany({});

        console.log("Old assets, transactions and watchlist removed.");

        // -----------------------------------------------------
        // Create assets
        // -----------------------------------------------------

        const assets = await Asset.insertMany([
            {
                ticker: "AAPL",
                name: "Apple Inc.",
                asset_class: "Equity",
            },
            {
                ticker: "RELIANCE",
                name: "Reliance Industries",
                asset_class: "Equity",
            },
            {
                ticker: "TCS",
                name: "Tata Consultancy Services",
                asset_class: "Equity",
            },
            {
                ticker: "BTC",
                name: "Bitcoin",
                asset_class: "Crypto",
            },
            {
                ticker: "AXISBLUE",
                name: "Axis Bluechip Fund",
                asset_class: "Mutual Funds",
            },
            {
                ticker: "CASH",
                name: "Wallet",
                asset_class: "Cash",
            },
        ]);

        // Quick lookup map

        const assetMap = {};

        assets.forEach(asset => {
            assetMap[asset.ticker] = asset;
        });

        // -----------------------------------------------------
        // Create transactions
        // -----------------------------------------------------

        await Transaction.insertMany([
            {
                user_id: user._id,
                asset_id: assetMap.AAPL._id,
                ticker_snapshot: "AAPL",
                type: "Buy",
                status: "Completed",
                quantity: 10,
                price_per_unit: 2125,
                amount: 21250,
                occurred_at: new Date("2026-07-10T10:15:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.RELIANCE._id,
                ticker_snapshot: "RELIANCE",
                type: "Buy",
                status: "Completed",
                quantity: 5,
                price_per_unit: 2578,
                amount: 12890,
                occurred_at: new Date("2026-07-11T13:10:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.TCS._id,
                ticker_snapshot: "TCS",
                type: "Buy",
                status: "Completed",
                quantity: 8,
                price_per_unit: 2273.75,
                amount: 18190,
                occurred_at: new Date("2026-07-12T09:30:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.AAPL._id,
                ticker_snapshot: "AAPL",
                type: "Sell",
                status: "Completed",
                quantity: 2,
                price_per_unit: 2300,
                amount: 4600,
                occurred_at: new Date("2026-07-14T11:45:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.BTC._id,
                ticker_snapshot: "BTC",
                type: "Buy",
                status: "Completed",
                quantity: 0.05,
                price_per_unit: 4300000,
                amount: 215000,
                occurred_at: new Date("2026-07-15T09:20:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.CASH._id,
                ticker_snapshot: "CASH",
                type: "Deposit",
                status: "Completed",
                quantity: null,
                price_per_unit: null,
                amount: 5000,
                occurred_at: new Date("2026-07-16T16:30:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.CASH._id,
                ticker_snapshot: "CASH",
                type: "Withdrawal",
                status: "Pending",
                quantity: null,
                price_per_unit: null,
                amount: 2000,
                occurred_at: new Date("2026-07-18T12:00:00"),
            },

            {
                user_id: user._id,
                asset_id: assetMap.AXISBLUE._id,
                ticker_snapshot: "AXISBLUE",
                type: "Buy",
                status: "Pending",
                quantity: 25,
                price_per_unit: 500,
                amount: 12500,
                occurred_at: new Date("2026-07-18T15:45:00"),
            },
        ]);

        // -----------------------------------------------------
        // Watchlist
        // -----------------------------------------------------

        await WatchlistItem.insertMany([
            {
                user_id: user._id,
                asset_id: assetMap.AAPL._id,
                favourite: true,
                trending: true,
                added_at: new Date("2026-07-01"),
            },
            {
                user_id: user._id,
                asset_id: assetMap.BTC._id,
                favourite: true,
                trending: true,
                added_at: new Date("2026-07-03"),
            },
            {
                user_id: user._id,
                asset_id: assetMap.RELIANCE._id,
                favourite: false,
                trending: false,
                added_at: new Date("2026-07-05"),
            },
        ]);

        console.log("Database seeded successfully.");
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await mongoose.connection.close();
    }
}

seed();