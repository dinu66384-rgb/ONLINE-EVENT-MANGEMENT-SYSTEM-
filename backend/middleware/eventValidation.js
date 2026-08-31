const validateEvent = (req, res, next) => {
    const {
        name,
        date,
        time,
        location,
        description,
        maxParticipants
    } = req.body;

    // Check required fields
    if (!name || !date || !time || !location) {
        return res.status(400).json({
            success: false,
            message: "Name, date, time and location are required"
        });
    }

    // Check maximum participants
    if (maxParticipants !== undefined && maxParticipants <= 0) {
        return res.status(400).json({
            success: false,
            message: "Maximum participants must be greater than 0"
        });
    }

    next();
};

module.exports = validateEvent;