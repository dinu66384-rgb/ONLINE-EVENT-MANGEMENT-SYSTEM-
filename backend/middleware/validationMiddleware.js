/**
 * Validation Middleware for Online Event Management System
 */

// Validate Registration payload
const validateRegister = (req, res, next) => {
    const { name, email, password, role } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push("Name is required and must be at least 2 characters long");
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("A valid email address is required");
    }

    if (!password || password.length < 6) {
        errors.push("Password is required and must be at least 6 characters long");
    }

    if (role && !["user", "organizer", "admin"].includes(role)) {
        errors.push("Role must be 'user', 'organizer', or 'admin'");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

// Validate Login payload
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
        errors.push("Email is required");
    }

    if (!password) {
        errors.push("Password is required");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

// Validate Event creation and update payload
const validateEvent = (req, res, next) => {
    const { title, description, category, eventDate, eventTime, location, capacity } = req.body;
    const errors = [];

    // For PUT updates, some fields might be optional, but if creating (POST) they are required
    if (req.method === "POST") {
        if (!title || title.trim().length < 3) {
            errors.push("Title is required and must be at least 3 characters");
        }
        if (!description || description.trim().length < 5) {
            errors.push("Description is required and must be at least 5 characters");
        }
        if (!eventDate || isNaN(Date.parse(eventDate))) {
            errors.push("Valid eventDate (YYYY-MM-DD) is required");
        }
        if (!eventTime || eventTime.trim().length < 2) {
            errors.push("Event time is required");
        }
        if (!location || location.trim().length < 2) {
            errors.push("Location / Venue is required");
        }
        if (capacity === undefined || Number(capacity) <= 0) {
            errors.push("Capacity must be a positive integer");
        }
    } else if (req.method === "PUT") {
        if (title !== undefined && title.trim().length < 3) {
            errors.push("Title must be at least 3 characters");
        }
        if (eventDate !== undefined && isNaN(Date.parse(eventDate))) {
            errors.push("Valid eventDate is required");
        }
        if (capacity !== undefined && Number(capacity) <= 0) {
            errors.push("Capacity must be a positive integer");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

// Validate Booking payload
const validateBooking = (req, res, next) => {
    const { eventId, ticketQuantity } = req.body;
    const errors = [];

    if (!eventId) {
        errors.push("eventId is required");
    }

    if (ticketQuantity !== undefined && (Number(ticketQuantity) <= 0 || Number(ticketQuantity) > 10)) {
        errors.push("ticketQuantity must be between 1 and 10");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateEvent,
    validateBooking
};
