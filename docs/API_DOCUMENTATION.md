# Online Event Management System - API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public
- **Description:** Registers a new user account, securely hashes the password with bcrypt (10 rounds), and returns user details and a JWT token.
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "organizer", // "user" (default), "organizer", or "admin"
  "phone": "+1234567890"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "660c1d2e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "organizer",
    "phone": "+1234567890",
    "createdAt": "2026-09-21T07:05:35.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.2 User Login
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public
- **Description:** Verifies credentials and returns a JWT authentication token.
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "660c1d2e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "organizer",
    "phone": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.3 Get Current User Profile
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Access:** Private (`Bearer <token>`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "660c1d2e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "organizer",
    "phone": "+1234567890",
    "createdAt": "2026-09-21T07:05:35.000Z"
  }
}
```

---

### 1.4 Logout
- **Method:** `POST`
- **Path:** `/api/auth/logout`
- **Access:** Private (`Bearer <token>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 2. Event Endpoints (`/api/events`)

### 2.1 Get All Events (Search, Filter, Sort, Pagination)
- **Method:** `GET`
- **Path:** `/api/events`
- **Access:** Public
- **Query Parameters:**
  - `search` *(string)*: Case-insensitive search on title, description, or location.
  - `category` *(string)*: Filter by category (`Conference`, `Workshop`, `Seminar`, `Networking`, `Concert`, `Webinar`, `Festival`, `Sports`, `Tech`, `Other`).
  - `location` *(string)*: Filter by location.
  - `status` *(string)*: `upcoming`, `ongoing`, `completed`, `cancelled`.
  - `startDate` *(date YYYY-MM-DD)*: Earliest date.
  - `endDate` *(date YYYY-MM-DD)*: Latest date.
  - `sort` *(string)*: e.g. `eventDate:asc`, `eventDate:desc`, `createdAt:desc`.
  - `page` *(number)*: Page number (default: `1`).
  - `limit` *(number)*: Items per page (default: `10`).
- **Response (200 OK):**
```json
{
  "success": true,
  "total": 12,
  "page": 1,
  "pages": 2,
  "count": 10,
  "data": [
    {
      "_id": "660c24a1...",
      "title": "Global Tech Summit 2026",
      "description": "Annual cloud and software engineering conference",
      "category": "Tech",
      "eventDate": "2026-11-20T00:00:00.000Z",
      "eventTime": "09:30 AM",
      "location": "Convention Center & Zoom",
      "capacity": 100,
      "registeredCount": 2,
      "availableSeats": 98,
      "price": 25,
      "status": "upcoming",
      "organizer": {
        "_id": "660c1d2e...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "organizer"
      }
    }
  ]
}
```

---

### 2.2 Get Event by ID
- **Method:** `GET`
- **Path:** `/api/events/:id`
- **Access:** Public
- **Response (200 OK):** Returns single event object with populated organizer.

---

### 2.3 Create Event
- **Method:** `POST`
- **Path:** `/api/events`
- **Access:** Private (Roles: `organizer`, `admin`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "title": "Global Tech Summit 2026",
  "description": "Annual cloud and software engineering conference",
  "category": "Tech",
  "eventDate": "2026-11-20",
  "eventTime": "09:30 AM",
  "location": "Convention Center & Zoom",
  "capacity": 100,
  "price": 25,
  "tags": ["Technology", "AI", "Cloud"]
}
```
- **Response (201 Created):** Returns created event object.

---

### 2.4 Update Event
- **Method:** `PUT`
- **Path:** `/api/events/:id`
- **Access:** Private (Event Organizer or Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Returns updated event object.

---

### 2.5 Delete Event
- **Method:** `DELETE`
- **Path:** `/api/events/:id`
- **Access:** Private (Event Organizer or Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Event and associated registrations deleted successfully"
}
```

---

## 3. Booking & Registration Endpoints (`/api/bookings`)

### 3.1 Book Tickets / Register for Event
- **Method:** `POST`
- **Path:** `/api/bookings`
- **Access:** Private (Authenticated Users)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "eventId": "660c24a1...",
  "ticketQuantity": 2,
  "notes": "Looking forward to attending!"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "_id": "660c389f...",
    "event": {
      "_id": "660c24a1...",
      "title": "Global Tech Summit 2026",
      "eventDate": "2026-11-20T00:00:00.000Z",
      "location": "Convention Center & Zoom"
    },
    "user": {
      "_id": "660c1e8a...",
      "name": "Jane Participant",
      "email": "jane@example.com"
    },
    "ticketQuantity": 2,
    "status": "confirmed",
    "registrationDate": "2026-09-21T07:05:35.000Z"
  }
}
```

---

### 3.2 Get My Bookings
- **Method:** `GET`
- **Path:** `/api/bookings/my-bookings`
- **Access:** Private (Authenticated User)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** List of bookings made by the logged-in user.

---

### 3.3 Get Attendees for Event
- **Method:** `GET`
- **Path:** `/api/bookings/event/:eventId`
- **Access:** Private (Organizer, Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Attendee list with user names, emails, and ticket quantities.

---

### 3.4 Cancel Booking
- **Method:** `DELETE`
- **Path:** `/api/bookings/:id`
- **Access:** Private (Booking Owner or Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## 4. User Management Endpoints (`/api/users`)

### 4.1 List Users (Admin)
- **Method:** `GET`
- **Path:** `/api/users`
- **Access:** Private (Admin)
- **Query Parameters:** `search`, `role`, `page`, `limit`

### 4.2 Get User by ID
- **Method:** `GET`
- **Path:** `/api/users/:id`
- **Access:** Private

### 4.3 Update User Profile
- **Method:** `PUT`
- **Path:** `/api/users/:id`
- **Access:** Private (Self or Admin)

### 4.4 Delete User
- **Method:** `DELETE`
- **Path:** `/api/users/:id`
- **Access:** Private (Admin)
