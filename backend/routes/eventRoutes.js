const express = require("express");
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const { validateEvent } = require("../middleware/validationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/events - List events with query filtering, search, pagination (Public)
router.get("/", getEvents);

// GET /api/events/:id - Get single event details (Public)
router.get("/:id", getEventById);

// POST /api/events - Create new event (Protected: Organizer, Admin)
router.post("/", protect, authorize("organizer", "admin"), validateEvent, createEvent);

// PUT /api/events/:id - Update event (Protected: Organizer, Admin)
router.put("/:id", protect, authorize("organizer", "admin"), validateEvent, updateEvent);

// DELETE /api/events/:id - Delete event (Protected: Organizer, Admin)
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);

module.exports = router;