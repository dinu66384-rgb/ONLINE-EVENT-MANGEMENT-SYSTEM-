const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(
                `=========================================\n` +
                ` Event Management Server Running\n` +
                ` Environment: ${process.env.NODE_ENV || "development"}\n` +
                ` Port:        ${PORT}\n` +
                ` URL:         http://localhost:${PORT}\n` +
                `=========================================`
            );
        });

        // Handle Unhandled Promise Rejections
        process.on("unhandledRejection", (err) => {
            console.error(`[Unhandled Rejection] ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error(`Server initialization failed: ${err.message}`);
        process.exit(1);
    }
};

startServer();