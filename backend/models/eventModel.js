const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"]
        },
        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: [
                    "Conference",
                    "Workshop",
                    "Seminar",
                    "Networking",
                    "Concert",
                    "Webinar",
                    "Festival",
                    "Sports",
                    "Tech",
                    "Other"
                ],
                message: "Category must be one of the supported types"
            },
            default: "Tech"
        },
        eventDate: {
            type: Date,
            required: [true, "Event date is required"]
        },
        eventTime: {
            type: String,
            required: [true, "Event time is required"],
            trim: true
        },
        location: {
            type: String,
            required: [true, "Location or venue is required"],
            trim: true
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Event must have an organizer"]
        },
        capacity: {
            type: Number,
            required: [true, "Event capacity is required"],
            min: [1, "Capacity must be at least 1"]
        },
        registeredCount: {
            type: Number,
            default: 0,
            min: [0, "Registered count cannot be negative"]
        },
        price: {
            type: Number,
            default: 0,
            min: [0, "Price cannot be negative"]
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming"
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual field for available seats
eventSchema.virtual("availableSeats").get(function () {
    return Math.max(0, this.capacity - this.registeredCount);
});

// Text index for search functionality (Week 6)
eventSchema.index({ title: "text", description: "text", location: "text" });
eventSchema.index({ category: 1, eventDate: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
