/**
 * Error Handling Middleware
 */

// 404 Not Found Handler
const notFound = (req, res, next) => {
    const error = new Error(`Resource not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ID format for resource: ${err.value}`;
    }

    // Handle Mongoose Duplicate Key Error (e.g. unique email or registration)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `Duplicate value entered for ${field}. Please use another value.`;
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authorization token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authorization token has expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
};
