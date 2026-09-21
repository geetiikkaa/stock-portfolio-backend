let multer = require("multer")
let storage = multer.diskStorage({
    destination: "userProfile",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})
let userProfile = multer({ storage })

module.exports = userProfile