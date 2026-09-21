require("dotenv").config();

const mongoose = require("mongoose");
const Asset = require("../models/assetSchema");

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY;

const seedAssets = async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Connected to MongoDB");

    await Asset.deleteMany({});

    const response = await fetch(
        `${FINNHUB_BASE_URL}/stock/symbol?exchange=US&token=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch symbols");
    }

    const symbols = await response.json();

    const assets = symbols
        .filter(
            (item) =>
                item.symbol &&
                item.description &&
                item.type === "Common Stock"
        )
        .map((item) => ({
            ticker: item.symbol,
            name: item.description,
            asset_class: "Equity",
        }));

    await Asset.insertMany(assets);

    console.log(`Inserted ${assets.length} assets`);

    mongoose.connection.close();
};

seedAssets().catch((err) => {
    console.error(err);
    mongoose.connection.close();
});