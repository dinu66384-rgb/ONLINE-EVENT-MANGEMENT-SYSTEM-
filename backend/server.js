
const express = require("express");

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const logger = require("./middleware/logger");

const app = express();

const PORT = 5000;

// ===============================
// Middleware
// ===============================

// Read JSON request body
app.use(express.json());

// Request logger
app.use(logger);

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Online Event Management System Server is Running",
        version: "1.0.0"
    });
});

// ===============================
// API Status
// ===============================

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "Online",
        service: "Event Management System API"
    });
});

// ===============================
// API Routes
// ===============================

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// ===============================
// 404 Error Handler
// ===============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});