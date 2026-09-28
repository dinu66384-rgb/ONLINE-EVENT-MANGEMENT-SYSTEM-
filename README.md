# Online Event Management System

An end-to-end full-stack **MERN** (MongoDB, Express.js, React, Node.js) platform designed to simplify event creation, discovery, attendee registration, and ticketing management.

---

## 1. Project Overview

### 1.1 Problem Statement
Managing events manually or across fragmented platforms often causes scheduling conflicts, untracked participant registrations, and lack of real-time capacity monitoring. The **Online Event Management System** solves this by providing a unified, scalable REST API and a modern, responsive React interface for event organizers, attendees, and system administrators.

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

## 2. Technology Stack (MERN)

- **Frontend:** React 19, Vite, React Router v7, Lucide Icons, Custom Vanilla CSS Design System
- **Backend:** Node.js (v20+), Express.js (v5)
- **Database:** MongoDB (with Mongoose ODM) & MySQL schema reference
- **Security & Authentication:** `bcryptjs` (password hashing with 10 salt rounds), `jsonwebtoken` (JWT), `cors`
- **Configuration:** `dotenv`
- **Testing:** Node.js Automated Integration Runner (`tests/test_api_runner.js`)

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
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx     # Event card with seat progress meter
│   │   │   ├── Navbar.jsx        # Sticky navigation with role badges & responsive menu
│   │   │   ├── Footer.jsx        # Project overview & milestone indicators
│   │   │   └── Loading.jsx       # Elegant animated spinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state, JWT handling & toast notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero section, statistics counter, featured events
│   │   │   ├── Events.jsx        # Event catalog with search, category tabs, sorting
│   │   │   ├── EventDetails.jsx  # Event details, seat availability, booking form, roster
│   │   │   ├── CreateEvent.jsx   # Form for organizers to publish events
│   │   │   ├── MyRegistrations.jsx # User ticket dashboard & cancellation
│   │   │   ├── Profile.jsx       # User profile details & update form
│   │   │   ├── AdminDashboard.jsx # Admin console with user management
│   │   │   ├── Login.jsx         # Sign in with 1-click test credentials
│   │   │   └── Register.jsx      # Sign up with role selection
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Route definitions & protected route guards
│   │   ├── services/
│   │   │   └── api.js            # Axios/Fetch API client with token interceptor
│   │   ├── index.css             # Vanilla CSS design tokens & animations
│   │   ├── App.jsx               # App wrapper
│   │   └── main.jsx
│   ├── vite.config.js            # Vite config with backend API proxy
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

## 4. 10-Week Lab Progression Alignment (Weeks 1 to 7 Complete)

| Week | Technical Focus | Milestone Completed | GitHub / Implementation Deliverables |
| :--- | :--- | :--- | :--- |
| **Week 1** | Node.js, NPM, Server-side scripting | Project Selection, Requirements, Server Foundation | `server.js`, `package.json`, `README.md` |
| **Week 2** | Event Loop, Modules, Asynchronous Programming | Modular Backend Architecture | `app.js`, `controllers/`, `routes/`, `models/`, `middleware/` |
| **Week 3** | Express.js Routing, Request/Response | API Routing & JSON Envelope Standard | `routes/*.js`, `docs/API_DOCUMENTATION.md` |
| **Week 4** | Middleware, Static Files, Error Handling | Middleware Pipeline & Centralized Errors | `logger.js`, `validationMiddleware.js`, `errorMiddleware.js` |
| **Week 5** | MongoDB Connectivity & Schemas | Database Connection & Mongoose Models | `config/db.js`, `models/*.js`, `schema.sql`, `.env` excluded |
| **Week 6** | CRUD Operations, Queries, Filtering | Full CRUD APIs with Filtering & Capacity | `eventController.js`, `bookingController.js`, `docs/API_TESTING_EVIDENCE.md` |
| **Week 7** | Authentication, Bcrypt, JWT / Sessions | User Signup/Login & Password Hashing | `authController.js`, `authMiddleware.js`, `docs/WEEK_7_SECURITY_REVIEW.md` |

---

## 5. Getting Started & Running the Application

### 5.1 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017`

### 5.2 Starting Backend and Frontend

#### Option A: Run from Root
```bash
# Start Backend API Server (port 5000)
npm run backend

# In a second terminal, start React Frontend (port 5173)
npm run frontend
```

#### Option B: Run individually
```bash
# 1. Backend Server:
cd backend
npm run dev
# Server will run on: http://localhost:5000

# 2. Frontend React Client:
cd frontend
npm run dev
# Client will run on: http://localhost:5173
```

Open your browser at **`http://localhost:5173`** to access the Online Event Management System.

---

## 6. Demo Accounts (1-Click Login Available)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Organizer** | `organizer@example.com` | `Password123!` | Create & edit events, inspect attendee rosters |
| **Participant** | `participant@example.com` | `Password123!` | Browse events, book tickets, cancel bookings |
| **Administrator** | `admin@example.com` | `Password123!` | Full system administration, user management |

---

## 7. Running the Automated Test Suite

To run all 26 automated integration tests covering Weeks 1 to 7:

```bash
npm run test
```

**Test Verification Summary:**
```text
==================================================
 Summary: 26/26 tests passed (100%)
==================================================
```
