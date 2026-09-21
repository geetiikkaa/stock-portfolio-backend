let Asset = require("../models/assetSchema");

let getAllAssets = async (req, res) => {
    try {
        let assets = await Asset.find().sort({ ticker: 1 });

        res.status(200).json({
            success: true,
            assets,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let getAssetById = async (req, res) => {
    try {
        let asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        res.status(200).json({
            success: true,
            asset,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let searchAssets = async (req, res) => {
    const query = req.query.q?.trim();

    if (!query) {
        return res.status(200).json({
            success: true,
            assets: [],
        });
    }
    try {
        const assets = await Asset.find({
            $or: [
                { ticker: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { external_id: { $regex: query, $options: "i" } },
            ],
        })
            .select("_id ticker name asset_class external_id")
            .limit(100);

        const q = query.toLowerCase();

        assets.sort((a, b) => {
            const aExternal = a.external_id?.toLowerCase() === q;
            const bExternal = b.external_id?.toLowerCase() === q;

            if (aExternal && !bExternal) return -1;
            if (!aExternal && bExternal) return 1;

            const aName = a.name.toLowerCase() === q;
            const bName = b.name.toLowerCase() === q;

            if (aName && !bName) return -1;
            if (!aName && bName) return 1;

            const aTicker = a.ticker.toLowerCase() === q;
            const bTicker = b.ticker.toLowerCase() === q;

            if (aTicker && !bTicker) return -1;
            if (!aTicker && bTicker) return 1;

            return a.name.localeCompare(b.name);
        });

        res.status(200).json({
            success: true,
            assets: assets.slice(0, 20),
        });
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let createAsset = async (req, res) => {
    try {
        let asset = await Asset.create(req.body);

        res.status(201).json({
            success: true,
            asset,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let updateAsset = async (req, res) => {
    try {
        let asset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        res.status(200).json({
            success: true,
            asset,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

let deleteAsset = async (req, res) => {
    try {
        let asset = await Asset.findByIdAndDelete(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getAllAssets,
    getAssetById,
    searchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
};