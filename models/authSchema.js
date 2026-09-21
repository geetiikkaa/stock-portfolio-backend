let mongoose = require("mongoose")
let authSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
})

module.exports = mongoose.model("User", authSchema);