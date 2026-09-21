const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Helper to generate JWT
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "event_management_super_secure_jwt_secret_key_2026_dev",
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || "user",
            phone: phone || ""
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and explicitly select password
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password with bcrypt
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user / clear token session
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Successfully logged out"
    });
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};
