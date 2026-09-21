const User = require("../models/userModel");
const Registration = require("../models/registrationModel");

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (role) {
            query.role = role;
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
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
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
    try {
        // Only self or admin can update
        if (
            req.user &&
            req.user.role !== "admin" &&
            req.user._id.toString() !== req.params.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this profile"
            });
        }

        const { name, phone, role } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        // Only admin can change role
        if (role && req.user?.role === "admin") {
            updateData.role = role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete user's registrations
        await Registration.deleteMany({ user: user._id });
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUserProfile,
    deleteUser
};
