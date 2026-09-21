let express = require("express")
let router = express.Router()
let { signup, login, getProfile, updateProfile } = require("../controllers/authController")
let verifyToken = require("../middlewares/authMiddleware")
let userProfile = require("../files/profileImage")

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", verifyToken, getProfile)
router.put("/update", verifyToken, userProfile.fields([{ name: "userImage", maxCount: 1 }]), updateProfile)

module.exports = router