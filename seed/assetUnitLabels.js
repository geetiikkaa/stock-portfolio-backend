require("dotenv").config()
const mongoose = require("mongoose");
const Asset = require("../models/assetSchema");
const MONGO_URI = process.env.MONGO_DB_URI;

const UNIT_LABELS = {
    Equity: "shares",
    ETF: "shares",
    "Mutual Fund": "units",
    Crypto: "coins",
    Commodity: "units",
    Bond: "bonds",
};

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);

        for (const [assetClass, unitLabels] of Object.entries(UNIT_LABELS)) {
            const result = await Asset.updateMany(
                { asset_class: assetClass },
                { $set: { unitLabel: unitLabels } }
            );

            console.log(
                `${assetClass}: updated ${result.modifiedCount} assets`
            );
        }

        console.log("Asset unit migration completed.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();