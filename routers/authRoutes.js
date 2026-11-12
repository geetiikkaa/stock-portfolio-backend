let express = require("express")
let router = express.Router()
let { signup, login, getProfile, updateProfile } = require("../controllers/authController")
let verifyToken = require("../middlewares/authMiddleware")
let userProfile = require("../files/profileImage")
let validate = require("../middlewares/validateMiddleware")
let { loginSchema, registerSchema } = require("../validators/authValidation")

router.post("/signup", validate(registerSchema), signup)
router.post("/login", validate(loginSchema), login)
router.get("/me", verifyToken, getProfile)
router.put("/update", verifyToken, userProfile.fields([{ name: "userImage", maxCount: 1 }]), updateProfile)

module.exports = router