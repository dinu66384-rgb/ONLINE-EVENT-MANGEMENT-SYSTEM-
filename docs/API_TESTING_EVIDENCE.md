# Week 6 Deliverable: API Testing Evidence

This document provides formal evidence of automated and manual API testing for all CRUD operations, filtering, pagination, and capacity management implemented in Week 6.

---

## 1. Test Suite Execution Summary

- **Test Runner:** `tests/test_api_runner.js`
- **Environment:** Node.js v24.13.1 / MongoDB 127.0.0.1:27017
- **Execution Date:** 2026-09-21
- **Total Test Cases:** 26
- **Passed:** 26 (100%)
- **Failed:** 0 (0%)

---

## 2. CRUD Endpoints Evidence Log

### 2.1 Event Creation (CREATE)
- **Endpoint:** `POST /api/events`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Payload:**
```json
{
  "title": "Global Tech Summit 2026",
  "description": "An annual premier conference for advanced cloud and software engineering.",
  "category": "Tech",
  "eventDate": "2026-11-20",
  "eventTime": "09:30 AM",
  "location": "Convention Center & Zoom",
  "capacity": 100,
  "price": 25,
  "tags": ["Technology", "AI", "Cloud"]
}
```
- **Response Status:** `201 Created`
- **Verified Output:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "6ab0d73f69f263d403741ee4",
    "title": "Global Tech Summit 2026",
    "category": "Tech",
    "capacity": 100,
    "registeredCount": 0,
    "status": "upcoming"
  }
}
```

---

### 2.2 Event Listing with Filtering & Search (READ)
- **Keyword Search:** `GET /api/events?search=Summit`
  - **Status:** `200 OK`
  - **Result:** Successfully filtered events whose title, description, or location contains "Summit".
- **Category Filter:** `GET /api/events?category=Tech`
  - **Status:** `200 OK`
  - **Result:** Filtered events matching category "Tech".
- **Pagination Verification:** `GET /api/events?page=1&limit=10`
  - **Status:** `200 OK`
  - **Metadata Verified:** `{ total: 1, page: 1, pages: 1, count: 1 }`.

---

### 2.3 Single Event Retrieval (READ)
- **Endpoint:** `GET /api/events/6ab0d73f69f263d403741ee4`
- **Response Status:** `200 OK`
- **Verified Output:** Successfully retrieved event with organizer sub-document populated (`name`, `email`, `role`).

---

### 2.4 Event Update (UPDATE)
- **Endpoint:** `PUT /api/events/6ab0d73f69f263d403741ee4`
- **Headers:** `Authorization: Bearer <ORGANIZER_TOKEN>`
- **Request Payload:**
```json
{
  "location": "Virtual Main Stage & Discord"
}
```
- **Response Status:** `200 OK`
- **Verified Output:** `location` field updated to `"Virtual Main Stage & Discord"`.

---

### 2.5 Event Registration / Booking (CREATE & CAPACITY)
- **Endpoint:** `POST /api/bookings`
- **Headers:** `Authorization: Bearer <PARTICIPANT_TOKEN>`
- **Request Payload:**
```json
{
  "eventId": "6ab0d73f69f263d403741ee4",
  "ticketQuantity": 2,
  "notes": "Excited to attend!"
}
```
- **Response Status:** `201 Created`
- **Capacity Verification:**
  - Event `registeredCount` updated from `0` to `2`.
  - Duplicate booking attempt by the same user returned `400 Bad Request` ("You have already registered for this event").

---

### 2.6 Attendee Roster (READ)
- **Endpoint:** `GET /api/bookings/event/6ab0d73f69f263d403741ee4`
- **Headers:** `Authorization: Bearer <ORGANIZER_TOKEN>`
- **Response Status:** `200 OK`
- **Verified Output:** Attendee list containing participant details and ticket counts.

---

### 2.7 Booking Cancellation (DELETE / UPDATE CAPACITY)
- **Endpoint:** `DELETE /api/bookings/6ab0d73f69f263d403741ee5`
- **Headers:** `Authorization: Bearer <PARTICIPANT_TOKEN>`
- **Response Status:** `200 OK`
- **Capacity Restoration:** Event `registeredCount` automatically decremented from `2` back to `0`.

---

### 2.8 Error Handling Verification
- **Route Not Found:** `GET /api/non-existent-route` -> `404 Not Found` with structured JSON.
- **CastError (Bad MongoDB ID):** `GET /api/events/invalid-mongo-id-12345` -> `400 Bad Request` with message `"Invalid ID format for resource: invalid-mongo-id-12345"`.
