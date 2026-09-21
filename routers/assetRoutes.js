let express = require("express");
let assetRouter = express.Router();
let {
    getAllAssets,
    getAssetById,
    searchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
} = require("../controllers/assetController");

assetRouter.get("/search", searchAssets)
assetRouter.get("/", getAllAssets);
assetRouter.get("/:id", getAssetById);
assetRouter.post("/", createAsset);
assetRouter.put("/:id", updateAsset);
assetRouter.delete("/:id", deleteAsset);

module.exports = assetRouter;