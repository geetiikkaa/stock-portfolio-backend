let express = require("express");
let transactionRouter = express.Router();
let {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");
let verifyToken = require("../middlewares/authMiddleware");

transactionRouter.use(verifyToken);
transactionRouter.get("/", getAllTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.post("/", createTransaction);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

module.exports = transactionRouter;