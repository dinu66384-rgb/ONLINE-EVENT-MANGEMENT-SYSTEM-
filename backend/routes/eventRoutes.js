const express = require("express");

const router = express.Router();

// GET all events
router.get("/", (req, res) => {
    res.json({
        message: "Get all events"
    });
});

// GET event by ID
router.get("/:id", (req, res) => {
    res.json({
        message: "Get event by ID",
        eventId: req.params.id
    });
});

// POST create event
router.post("/", (req, res) => {
    res.json({
        message: "Create event",
        data: req.body
    });
});

// PUT update event
router.put("/:id", (req, res) => {
    res.json({
        message: "Update event",
        eventId: req.params.id,
        data: req.body
    });
});

// DELETE event
router.delete("/:id", (req, res) => {
    res.json({
        message: "Delete event",
        eventId: req.params.id
    });
});

module.exports = router;