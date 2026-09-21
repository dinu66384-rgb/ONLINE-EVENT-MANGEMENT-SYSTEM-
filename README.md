# Online Event Management System

An end-to-end full-stack platform designed to simplify event creation, discovery, attendee registration, and ticketing management.

---

## 1. Project Overview

### 1.1 Problem Statement
Managing events manually or across fragmented platforms often causes scheduling conflicts, untracked participant registrations, and lack of real-time capacity monitoring. The **Online Event Management System** solves this by providing a unified, scalable REST API and modern interface for event organizers, attendees, and system administrators.

### 1.2 Objectives
- Provide a centralized hub for creating, discovering, and managing online and in-person events.
- Enable users to register for events with real-time seat availability tracking.
- Secure event data with encrypted passwords (bcrypt) and token-based authentication (JWT).
- Provide event organizers with attendee lists and event analytics.
- Equip administrators with full user and event management capabilities.

### 1.3 Target Users
1. **Administrator:** Manages system users, oversees all events, and enforces system integrity.
2. **Event Organizer:** Creates, updates, and monitors events; manages participant rosters.
3. **Participant / User:** Browses events, filters by category/date, books tickets, and manages personal registrations.

---

## 2. Technology Stack

- **Runtime:** Node.js (v20+)
- **Backend Framework:** Express.js (v5)
- **Database:** MongoDB (with Mongoose ODM) & MySQL schema reference
- **Security & Authentication:** `bcryptjs` (password hashing), `jsonwebtoken` (JWT), `cors`
- **Configuration:** `dotenv`
- **Testing:** Node.js Automated Integration Runner (`tests/test_api_runner.js`)
- **Frontend (Planned):** React / Vite

---

## 3. Project Architecture & Structure

```
ONLINE-EVENT-MANAGEMENT-SYSTEM/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection manager
│   ├── controllers/
│   │   ├── authController.js     # User signup, login, profile, logout
│   │   ├── eventController.js    # Event CRUD, search, filter, pagination
│   │   ├── bookingController.js  # Booking CRUD, capacity counter, attendee list
│   │   └── userController.js     # User management CRUD (admin)
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & role authorization guard
│   │   ├── validationMiddleware.js # Input validation for auth, events, bookings
│   │   ├── errorMiddleware.js    # 404 handler and global error formatter
│   │   └── logger.js             # HTTP request duration logger
│   ├── models/
│   │   ├── userModel.js          # User schema with bcrypt pre-save hook
│   │   ├── eventModel.js         # Event schema with text indexing & capacity virtual
│   │   └── registrationModel.js  # Booking schema with unique compound index
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── eventRoutes.js        # Event CRUD endpoints
│   │   ├── bookingRoutes.js      # Booking & registration endpoints
│   │   └── userRoutes.js         # User administration endpoints
│   ├── app.js                    # Express application configuration
│   ├── server.js                 # Server entrypoint and DB initialization
│   ├── schema.sql                # Relational MySQL schema specification
│   ├── .env.example              # Environment variables template
│   └── package.json
├── docs/
│   ├── API_DOCUMENTATION.md      # Full REST API endpoint reference
│   ├── API_TESTING_EVIDENCE.md   # Week 6 CRUD test execution log
│   ├── WEEK_7_SECURITY_REVIEW.md # Week 7 Bcrypt & JWT security analysis
│   └── WEEK_1_TO_WEEK_7_PROGRESS_REPORT.md # 10-week syllabus tracking report
├── tests/
│   └── test_api_runner.js        # Automated end-to-end integration test runner
├── .gitignore                    # Environment & dependency ignore rules
└── README.md
```

---

## 4. Getting Started & Setup

### 4.1 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017`

### 4.2 Installation
```bash
# Clone the repository
git clone https://github.com/dinu66384-rgb/ONLINE-EVENT-MANGEMENT-SYSTEM-.git
cd ONLINE-EVENT-MANGEMENT-SYSTEM-

# Navigate to backend and install dependencies
cd backend
npm install
```

### 4.3 Environment Configuration
Create a `.env` file in the `backend/` directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/event_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### 4.4 Running the Application
```bash
# Start backend server
npm start

# Or start in development mode with nodemon
npm run dev
```

### 4.5 Running Automated Tests
To run the complete automated test suite covering all functionality from Weeks 1 through 7:
```bash
cd backend
node ../tests/test_api_runner.js
```

---

## 5. API Quick Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user / organizer | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET` | `/api/auth/me` | Get profile of logged-in user | Private |
| `POST` | `/api/auth/logout` | Log out user | Private |
| `GET` | `/api/events` | List events with filtering, search, pagination | Public |
| `GET` | `/api/events/:id` | Get details of single event | Public |
| `POST` | `/api/events` | Create new event | Private (Organizer, Admin) |
| `PUT` | `/api/events/:id` | Update event details | Private (Owner, Admin) |
| `DELETE` | `/api/events/:id` | Delete event and registrations | Private (Owner, Admin) |
| `POST` | `/api/bookings` | Book tickets for an event | Private (User) |
| `GET` | `/api/bookings/my-bookings` | Get logged-in user's bookings | Private (User) |
| `GET` | `/api/bookings/event/:eventId` | Get attendee roster for event | Private (Organizer, Admin) |
| `DELETE` | `/api/bookings/:id` | Cancel booking & restore capacity | Private (Owner, Admin) |
| `GET` | `/api/users` | List all users | Private (Admin) |

For comprehensive payload schemas, see [API Documentation](docs/API_DOCUMENTATION.md).

---

## 6. Project Progression Status (Weeks 1-7 Complete)

- [x] **Week 1:** Project Initiation, Scope, Architecture & Basic Node.js server
- [x] **Week 2:** Modular Architecture & Asynchronous programming
- [x] **Week 3:** Express Routing & Initial API documentation
- [x] **Week 4:** Middleware Pipeline, Validation & Centralized Error Handling
- [x] **Week 5:** MongoDB Connection, Mongoose Models (`User`, `Event`, `Registration`), `.env` protection
- [x] **Week 6:** Complete CRUD APIs with Search, Filtering, Pagination, and Testing Evidence
- [x] **Week 7:** Authentication with Bcrypt Password Hashing, JWT Tokens, and Security Review
- [ ] **Week 8:** Advanced Security, Logging & Debugging
- [ ] **Week 9:** Frontend-Backend Integration
- [ ] **Week 10:** Cloud Deployment & Final Demonstration
