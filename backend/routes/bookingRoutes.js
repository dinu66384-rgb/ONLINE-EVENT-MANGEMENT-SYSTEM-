const express = require("express");

const router = express.Router();

// GET all bookings
router.get("/", (req, res) => {
    res.json({
        message: "Get all bookings"
    });
});

// GET booking by ID
router.get("/:id", (req, res) => {
    res.json({
        message: "Get booking by ID",
        bookingId: req.params.id
    });
});

// POST create booking
router.post("/", (req, res) => {
    res.json({
        message: "Create booking",
        data: req.body
    });
});

module.exports = router;