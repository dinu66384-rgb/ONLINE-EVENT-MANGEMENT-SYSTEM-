const express = require("express");

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
    res.json({
        message: "Get all users"
    });
});

// GET user by ID
router.get("/:id", (req, res) => {
    res.json({
        message: "Get user by ID",
        userId: req.params.id
    });
});

module.exports = router;