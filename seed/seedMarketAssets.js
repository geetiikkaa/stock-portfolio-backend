require("dotenv").config()
const mongoose = require("mongoose");
const Asset = require("../models/assetSchema");

const MONGO_URI = process.env.MONGO_DB_URI;

const marketAssets = [
    ["RELIANCE", "Reliance Industries", "RELIANCE.NS"],
    ["TCS", "Tata Consultancy Services", "TCS.NS"],
    ["HDFCBANK", "HDFC Bank", "HDFCBANK.NS"],
    ["ICICIBANK", "ICICI Bank", "ICICIBANK.NS"],
    ["INFY", "Infosys", "INFY.NS"],
    ["SBIN", "State Bank of India", "SBIN.NS"],
    ["BHARTIARTL", "Bharti Airtel", "BHARTIARTL.NS"],
    ["ITC", "ITC", "ITC.NS"],
    ["LT", "Larsen & Toubro", "LT.NS"],
    ["HINDUNILVR", "Hindustan Unilever", "HINDUNILVR.NS"],
    ["AXISBANK", "Axis Bank", "AXISBANK.NS"],
    ["KOTAKBANK", "Kotak Mahindra Bank", "KOTAKBANK.NS"],
    ["BAJFINANCE", "Bajaj Finance", "BAJFINANCE.NS"],
    ["MARUTI", "Maruti Suzuki India", "MARUTI.NS"],
    ["SUNPHARMA", "Sun Pharmaceutical Industries", "SUNPHARMA.NS"],
    ["TATAMOTORS", "Tata Motors", "TATAMOTORS.NS"],
    ["TATASTEEL", "Tata Steel", "TATASTEEL.NS"],
    ["ADANIENT", "Adani Enterprises", "ADANIENT.NS"],
    ["NTPC", "NTPC", "NTPC.NS"],
    ["POWERGRID", "Power Grid Corporation of India", "POWERGRID.NS"],
];

async function seedMarketAssets() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        for (const [ticker, name, yahooSymbol] of marketAssets) {
            await Asset.updateOne(
                { ticker },
                {
                    $set: {
                        ticker,
                        name,
                        asset_class: "Equity",
                        yahoo_symbol: yahooSymbol,
                        isMarketTracked: true,
                    },
                },
                { upsert: true }
            );

            console.log(`Seeded: ${ticker}`);
        }

        console.log("Market assets seeded successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed");
    }
}

seedMarketAssets();