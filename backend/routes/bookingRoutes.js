const express = require("express");
const router = express.Router();

const {
    createBooking,
    getBookings,
    getMyBookings,
    getEventAttendees,
    getBookingById,
    cancelBooking
} = require("../controllers/bookingController");

const { validateBooking } = require("../middleware/validationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

// POST /api/bookings - Book/register for an event (Protected: all authenticated users)
router.post("/", protect, validateBooking, createBooking);

// GET /api/bookings/my-bookings - Get logged-in user's bookings (Protected)
router.get("/my-bookings", protect, getMyBookings);

// GET /api/bookings/event/:eventId - Get attendees for an event (Protected: Organizer, Admin)
router.get("/event/:eventId", protect, authorize("organizer", "admin"), getEventAttendees);

// GET /api/bookings - Get all bookings (Protected: Admin, Organizer)
router.get("/", protect, authorize("admin", "organizer"), getBookings);

// GET /api/bookings/:id - Get booking details (Protected)
router.get("/:id", protect, getBookingById);

// DELETE /api/bookings/:id - Cancel booking (Protected: owner or admin)
router.delete("/:id", protect, cancelBooking);

module.exports = router;