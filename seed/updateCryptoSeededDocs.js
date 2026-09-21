require("dotenv").config();

const mongoose = require("mongoose");
const Asset = require("../models/assetSchema");

const COINGECKO_LIST_URL =
    "https://api.coingecko.com/api/v3/coins/list";


async function updateCryptoIds() {

    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Connected");

    const response = await fetch(COINGECKO_LIST_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch CoinGecko list");
    }

    const coins = await response.json();

    const cryptoAssets = await Asset.find({
        asset_class: "Crypto"
    });

    console.log(
        `Found ${cryptoAssets.length} crypto assets`
    );


    for (const asset of cryptoAssets) {

        const coin = coins.find(
            (c) =>
                c.symbol.toUpperCase() === asset.ticker &&
                c.name.toLowerCase() === asset.name.toLowerCase()
        );


        if (coin) {

            await Asset.updateOne(
                {
                    _id: asset._id
                },
                {
                    external_id: coin.id
                }
            );

            console.log(
                `${asset.ticker} -> ${coin.id}`
            );

        } else {

            console.log(
                `No match: ${asset.ticker} ${asset.name}`
            );

        }
    }


    mongoose.connection.close();
}


updateCryptoIds()
.catch((err)=>{
    console.error(err);
    mongoose.connection.close();
});