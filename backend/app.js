const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ===============================
// Core Middleware
// ===============================

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(logger);

// Serve static assets if public directory exists
app.use("/public", express.static(path.join(__dirname, "public")));

// ===============================
// Base / Health Check Routes
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Online Event Management System API is running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            events: "/api/events",
            bookings: "/api/bookings",
            users: "/api/users",
            status: "/api/status"
        }
    });
});

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "Online",
        service: "Event Management System API",
        timestamp: new Date().toISOString()
    });
});

// ===============================
// Mount API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/registrations", bookingRoutes);
app.use("/api/users", userRoutes);

// ===============================
// Error Handling Middleware
// ===============================

// 404 Route Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
