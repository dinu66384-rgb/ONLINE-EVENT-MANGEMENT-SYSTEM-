const Registration = require("../models/registrationModel");
const Event = require("../models/eventModel");

/**
 * @desc    Create a new booking / registration for an event
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
    try {
        const { eventId, ticketQuantity = 1, notes } = req.body;
        const userId = req.user ? req.user._id : req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find target event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cannot register for a cancelled event"
            });
        }

        // Check if user already has an active registration for this event
        const existing = await Registration.findOne({
            event: eventId,
            user: userId,
            status: "confirmed"
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already registered for this event"
            });
        }

        // Check capacity
        const requestedQuantity = parseInt(ticketQuantity, 10) || 1;
        if (event.registeredCount + requestedQuantity > event.capacity) {
            const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
            return res.status(400).json({
                success: false,
                message: `Not enough seats available. Only ${seatsLeft} seat(s) remaining.`
            });
        }

        // Create registration
        const booking = await Registration.create({
            event: eventId,
            user: userId,
            ticketQuantity: requestedQuantity,
            notes: notes || "",
            status: "confirmed"
        });

        // Increment event registeredCount
        await Event.findByIdAndUpdate(eventId, {
            $inc: { registeredCount: requestedQuantity }
        });

        const populatedBooking = await Registration.findById(booking._id)
            .populate("event", "title eventDate eventTime location price")
            .populate("user", "name email");

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: populatedBooking
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all bookings (Admin/Organizer filterable)
 * @route   GET /api/bookings
 * @access  Private
 */
const getBookings = async (req, res, next) => {
    try {
        const { eventId, userId, status } = req.query;
        const query = {};

        if (eventId) query.event = eventId;
        if (userId) query.user = userId;
        if (status) query.status = status;

        const bookings = await Registration.find(query)
            .populate("event", "title eventDate location")
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's registered bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookings = await Registration.find({ user: userId })
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendees for a specific event
 * @route   GET /api/bookings/event/:eventId
 * @access  Private (organizer or admin)
 */
const getEventAttendees = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const attendees = await Registration.find({
            event: eventId,
            status: "confirmed"
        }).populate("user", "name email phone");

        res.status(200).json({
            success: true,
            eventTitle: event.title,
            count: attendees.length,
            capacity: event.capacity,
            data: attendees
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
    try {
        const booking = await Registration.findById(req.params.id)
            .populate("event")
            .populate("user", "name email");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Registration.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check permission: only booking owner or admin can cancel
        if (
            req.user &&
            req.user.role !== "admin" &&
            booking.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this booking"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        // Decrement event registeredCount
        await Event.findByIdAndUpdate(booking.event, {
            $inc: { registeredCount: -booking.ticketQuantity }
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getBookings,
    getMyBookings,
    getEventAttendees,
    getBookingById,
    cancelBooking
};
