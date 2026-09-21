const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
} = require("../controllers/authController");

const {
    validateRegister,
    validateLogin
} = require("../middleware/validationMiddleware");

const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register - Register new account
router.post("/register", validateRegister, registerUser);

// POST /api/auth/login - User login
router.post("/login", validateLogin, loginUser);

// GET /api/auth/me - Get current authenticated user profile
router.get("/me", protect, getCurrentUser);

// POST /api/auth/logout - Logout user
router.post("/logout", protect, logoutUser);

module.exports = router;
