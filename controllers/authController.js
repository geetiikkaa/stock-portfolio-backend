let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")
let User = require("../models/authSchema")

let signup = async (req, res) => {
    let { name, email, password, confirmPassword, phone, location } = req.body;

    try {
        // Return UNPROCESSABLE ENTITY when passwords don't match.
        if (password !== confirmPassword) {
            return res.status(422).json({ success: false, message: "Passwords do not match." })
        }

        // Find user by email in Database.
        let user = await User.findOne({ email })

        // Return CONFLICT if already exists.
        if (user) {
            return res.status(409).json({ success: false, message: "Email already registered." })
        }

        // Hash password.
        let hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            location
        })

        // Generate signature for data.
        let token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET_KEY)

        // Return OK along with user object.
        return res.status(201).json({
            success: true,
            message: "Registartion successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

let login = async (req, res) => {
    let { email, password } = req.body

    try {
        // Find user.
        let user = await User.findOne({ email })

        // Return NOT FOUND if doesn't exist in Database.
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." })
        }

        // Generate signature for data.
        let token = jwt.sign(
            {
                id: user._id,
                email: user.email
            }, process.env.SECRET_KEY
        )

        // Return OK along with user object.
        return res.status(200).json({
            success: true, message: "Login successful.", token, user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

let getProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select("-password")

        return res.status(200).json(user)
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." })
    }
}

let updateProfile = async (req, res) => {
    let { name, phone, location } = req.body

    try {
        let user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." })
        }

        if (name) user.name = name
        if (phone) user.phone = phone
        if (location) user.location = location
        if (req.files && req.files.userImage) user.image = req.files.userImage[0].filename

        await user.save()

        return res.status(200).json({ success: true, message: "Profile updated successfully.", user: { name: user.name, email: user.email, phone: user.phone, location: user.location, image: user.image, created_at: user.created_at } })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { signup, login, getProfile, updateProfile }