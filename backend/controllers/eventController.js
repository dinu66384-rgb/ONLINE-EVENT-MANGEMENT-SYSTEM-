const Event = require("../models/eventModel");
const Registration = require("../models/registrationModel");

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (organizer, admin)
 */
const createEvent = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            eventDate,
            eventTime,
            location,
            capacity,
            price,
            tags
        } = req.body;

        const event = await Event.create({
            title,
            description,
            category: category || "Tech",
            eventDate,
            eventTime,
            location,
            capacity,
            price: price || 0,
            tags: tags || [],
            organizer: req.user ? req.user._id : req.body.organizer
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all events with queries, filtering, search, and pagination (Week 6)
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res, next) => {
    try {
        const {
            search,
            category,
            location,
            status,
            startDate,
            endDate,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // Build query filter
        const query = {};

        // Keyword search across title, description, or location
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Date range filter
        if (startDate || endDate) {
            query.eventDate = {};
            if (startDate) {
                query.eventDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.eventDate.$lte = new Date(endDate);
            }
        }

        // Pagination setup
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        // Sorting setup
        let sortOption = { eventDate: 1 };
        if (sort) {
            const parts = sort.split(":");
            sortOption = { [parts[0]]: parts[1] === "desc" ? -1 : 1 };
        }

        // Execute query
        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .populate("organizer", "name email role")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate(
            "organizer",
            "name email role"
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (organizer or admin)
 */
const updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Verify authorization if user is logged in: only organizer of the event or admin can edit
        if (
            req.user &&
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this event"
            });
        }

        // Validate capacity update against current registered count
        if (
            req.body.capacity !== undefined &&
            Number(req.body.capacity) < event.registeredCount
        ) {
            return res.status(400).json({
                success: false,
                message: `Capacity cannot be lower than current registered attendees (${event.registeredCount})`
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (organizer or admin)
 */
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Verify authorization: only organizer or admin can delete
        if (
            req.user &&
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this event"
            });
        }

        // Delete associated registrations
        await Registration.deleteMany({ event: event._id });
        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: "Event and associated registrations deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
