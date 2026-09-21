let mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("Database connected successfully.")
}).catch(() => {
    console.log("Database not connected.")
})

module.exports = mongoose