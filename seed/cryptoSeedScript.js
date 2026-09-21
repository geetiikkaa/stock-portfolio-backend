require("dotenv").config();

const mongoose = require("mongoose");
const Asset = require("../models/assetSchema");

const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/list";

const seedCryptoAssets = async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Connected to MongoDB");

    const response = await fetch(COINGECKO_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch crypto list");
    }

    const coins = await response.json();

    const assets = coins
        .filter(
            (coin) =>
                coin.symbol &&
                coin.name
        )
        .map((coin) => ({
            ticker: coin.symbol.toUpperCase(),
            name: coin.name,
            asset_class: "Crypto",
            external_id: coin.id
        }));

    // Insert crypto assets
    await Asset.insertMany(assets, { ordered: false })
        .catch((err) => {
            // Ignore duplicate key errors if assets already exist
            if (err.code !== 11000) {
                throw err;
            }
        });

    console.log(`Inserted ${assets.length} crypto assets`);

    mongoose.connection.close();
};

seedCryptoAssets().catch((err) => {
    console.error(err);
    mongoose.connection.close();
});