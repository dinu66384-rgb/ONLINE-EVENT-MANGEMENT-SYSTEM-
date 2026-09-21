# Backend - Online Event Management System

## Overview
Express.js & MongoDB REST API for the Online Event Management System, providing authentication, event management, and booking functionality.

## Scripts
- `npm start`: Start server with Node (`node server.js`)
- `npm run dev`: Start server in watch mode with Nodemon (`nodemon server.js`)
- `node ../tests/test_api_runner.js`: Execute complete integration test suite

## Environment Variables
Defined in `.env` (template available in `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/event_management
JWT_SECRET=event_management_super_secure_jwt_secret_key_2026_dev
JWT_EXPIRES_IN=7d
```

## Structure
- `config/`: Database connection configuration
- `controllers/`: Request handler logic for Auth, Events, Bookings, Users
- `middleware/`: Auth verification, role guards, body validation, error handling, logging
- `models/`: Mongoose schemas for User, Event, Registration
- `routes/`: Express modular route definitions
- `services/`: External service integration
- `utils/`: Helper utilities
