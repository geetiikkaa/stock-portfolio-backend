const { z } = require("zod");

// Login validation
const loginSchema = z.object({
    email: z.email({
        error: "Please enter a valid email address"
    })
        .trim()
        .max(254),

    password: z.string()
        .min(1, {
            error: "Password is required"
        })
        .max(128, {
            error: "Password is too long"
        })
});

// Registration validation
const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(2, {
            error: "Name must contain at least 2 characters"
        })
        .max(50, {
            error: "Name cannot exceed 50 characters"
        }),

    email: z.email({
        error: "Please enter a valid email address"
    })
        .trim()
        .max(254),

    password: z.string()
        .min(8, {
            error: "Password must contain at least 8 characters"
        })
        .max(128, {
            error: "Password is too long"
        }),

    confirmPassword: z.string(),

    phone: z.string()
        .trim()
        .min(10, {
            error: "Phone number must contain at least 10 characters"
        })
        .max(15, {
            error: "Phone number cannot exceed 15 characters"
        }),

    location: z.string()
        .trim()
        .min(2, {
            error: "Location is required"
        })
        .max(100, {
            error: "Location cannot exceed 100 characters"
        })

}).refine(
    (data) => data.password === data.confirmPassword,
    {
        error: "Passwords do not match",
        path: ["confirmPassword"]
    }
);

module.exports = {
    loginSchema,
    registerSchema
};