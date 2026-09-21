const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    updateUserProfile,
    deleteUser
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/users - List users (Protected: Admin only)
router.get("/", protect, authorize("admin"), getUsers);

// GET /api/users/:id - Get single user (Protected)
router.get("/:id", protect, getUserById);

// PUT /api/users/:id - Update user profile (Protected: Self or Admin)
router.put("/:id", protect, updateUserProfile);

// DELETE /api/users/:id - Delete user (Protected: Admin only)
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;