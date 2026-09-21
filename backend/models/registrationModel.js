const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        ticketQuantity: {
            type: Number,
            default: 1,
            min: [1, "Ticket quantity must be at least 1"],
            max: [10, "Cannot book more than 10 tickets at once"]
        },
        status: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed"
        },
        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate active registration for the same user and event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
