/**
 * Automated Test Runner for Online Event Management System (Weeks 1-7)
 * Tests Auth (Bcrypt, JWT), Event CRUD, Filtering, Pagination, Bookings, Capacity, RBAC & Error handling.
 */

const path = require("path");
const dotenv = require("../backend/node_modules/dotenv");

// Load backend environment variables
dotenv.config({ path: path.join(__dirname, "..", "backend", ".env") });

const app = require("../backend/app");
const connectDB = require("../backend/config/db");
const mongoose = require("../backend/node_modules/mongoose");

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Test suite state
let server;
let organizerToken = "";
let participantToken = "";
let organizerId = "";
let participantId = "";
let createdEventId = "";
let createdBookingId = "";

const results = [];

function recordTest(name, passed, details = "") {
    results.push({ name, passed, details });
    const mark = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`  ${mark} - ${name} ${details ? `(${details})` : ""}`);
}

async function runTests() {
    console.log("\n==================================================");
    console.log(" Starting Test Suite: Online Event Management System (Weeks 1-7)");
    console.log("==================================================\n");

    // 1. Connect DB and start test server instance
    await connectDB();
    await new Promise((resolve) => {
        server = app.listen(TEST_PORT, resolve);
    });
    console.log(`[Test Server] Listening on ${BASE_URL}\n`);

    const timestamp = Date.now();
    const organizerEmail = `organizer_${timestamp}@test.com`;
    const participantEmail = `participant_${timestamp}@test.com`;

    try {
        // --- TEST 1: Server Base & Health Check (Weeks 1, 3, 4) ---
        console.log("--- 1. Health & Base Endpoints ---");
        const resRoot = await fetch(`${BASE_URL}/`);
        const jsonRoot = await resRoot.json();
        recordTest("GET / returns 200 with API endpoints info", resRoot.status === 200 && jsonRoot.success === true);

        const resStatus = await fetch(`${BASE_URL}/api/status`);
        const jsonStatus = await resStatus.json();
        recordTest("GET /api/status returns service online", resStatus.status === 200 && jsonStatus.status === "Online");

        // --- TEST 2: Authentication - Registration (Week 7) ---
        console.log("\n--- 2. Authentication: Registration & Password Hashing ---");
        const resRegOrganizer = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Organizer",
                email: organizerEmail,
                password: "Password123!",
                role: "organizer",
                phone: "1234567890"
            })
        });
        const jsonRegOrganizer = await resRegOrganizer.json();
        organizerToken = jsonRegOrganizer.token;
        organizerId = jsonRegOrganizer.data?._id;
        recordTest(
            "POST /api/auth/register creates organizer & returns JWT",
            resRegOrganizer.status === 201 && !!organizerToken && !jsonRegOrganizer.data.password,
            `User ID: ${organizerId}`
        );

        const resRegParticipant = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Participant",
                email: participantEmail,
                password: "Password123!",
                role: "user"
            })
        });
        const jsonRegParticipant = await resRegParticipant.json();
        participantToken = jsonRegParticipant.token;
        participantId = jsonRegParticipant.data?._id;
        recordTest(
            "POST /api/auth/register creates regular participant",
            resRegParticipant.status === 201 && !!participantToken
        );

        // Duplicate email rejection
        const resDup = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Duplicate User",
                email: organizerEmail,
                password: "Password123!"
            })
        });
        recordTest("POST /api/auth/register rejects duplicate email", resDup.status === 400);

        // Validation error on short password
        const resShortPass = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Short Pass",
                email: `short_${timestamp}@test.com`,
                password: "123"
            })
        });
        recordTest("POST /api/auth/register validates min password length (6 chars)", resShortPass.status === 400);

        // --- TEST 3: Authentication - Login & Bcrypt Verification (Week 7) ---
        console.log("\n--- 3. Authentication: Login & Bcrypt Compare ---");
        const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: organizerEmail,
                password: "Password123!"
            })
        });
        const jsonLogin = await resLogin.json();
        recordTest("POST /api/auth/login authenticates with valid credentials", resLogin.status === 200 && !!jsonLogin.token);

        const resWrongLogin = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: organizerEmail,
                password: "WrongPassword!"
            })
        });
        recordTest("POST /api/auth/login rejects incorrect password with 401", resWrongLogin.status === 401);

        // --- TEST 4: Protected Routes & Auth Middleware (Week 7) ---
        console.log("\n--- 4. Protected Routes & JWT Middleware ---");
        const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${organizerToken}` }
        });
        const jsonMe = await resMe.json();
        recordTest(
            "GET /api/auth/me returns profile for valid JWT",
            resMe.status === 200 && jsonMe.data?.email === organizerEmail
        );

        const resMeNoToken = await fetch(`${BASE_URL}/api/auth/me`);
        recordTest("GET /api/auth/me returns 401 when token is missing", resMeNoToken.status === 401);

        // --- TEST 5: Event CRUD & RBAC (Week 6 & Week 7) ---
        console.log("\n--- 5. Event CRUD Operations & RBAC ---");
        // Role authorization check: user role cannot create event
        const resCreateUnauthorized = await fetch(`${BASE_URL}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${participantToken}`
            },
            body: JSON.stringify({
                title: "Unauthorized Event",
                description: "This should fail",
                category: "Tech",
                eventDate: "2026-10-15",
                eventTime: "10:00 AM",
                location: "Online",
                capacity: 50
            })
        });
        recordTest("POST /api/events blocks non-organizer (403 Forbidden)", resCreateUnauthorized.status === 403);

        // Organizer creates event
        const resCreateEvent = await fetch(`${BASE_URL}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${organizerToken}`
            },
            body: JSON.stringify({
                title: "Global Tech Summit 2026",
                description: "An annual premier conference for advanced cloud and software engineering.",
                category: "Tech",
                eventDate: "2026-11-20",
                eventTime: "09:30 AM",
                location: "Convention Center & Zoom",
                capacity: 100,
                price: 25,
                tags: ["Technology", "AI", "Cloud"]
            })
        });
        const jsonCreateEvent = await resCreateEvent.json();
        createdEventId = jsonCreateEvent.data?._id;
        recordTest(
            "POST /api/events creates event with organizer credentials",
            resCreateEvent.status === 201 && !!createdEventId,
            `Event ID: ${createdEventId}`
        );

        // GET all events
        const resGetEvents = await fetch(`${BASE_URL}/api/events`);
        const jsonGetEvents = await resGetEvents.json();
        recordTest(
            "GET /api/events returns list with pagination metadata",
            resGetEvents.status === 200 && jsonGetEvents.total >= 1 && Array.isArray(jsonGetEvents.data)
        );

        // Search and filter events
        const resSearch = await fetch(`${BASE_URL}/api/events?search=Summit`);
        const jsonSearch = await resSearch.json();
        recordTest(
            "GET /api/events?search=Summit filters events by keyword",
            resSearch.status === 200 && jsonSearch.data.some((e) => e.title.includes("Summit"))
        );

        const resCategory = await fetch(`${BASE_URL}/api/events?category=Tech`);
        const jsonCategory = await resCategory.json();
        recordTest(
            "GET /api/events?category=Tech filters events by category",
            resCategory.status === 200 && jsonCategory.data.every((e) => e.category === "Tech")
        );

        // GET single event by ID
        const resGetEvent = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
        const jsonGetEvent = await resGetEvent.json();
        recordTest(
            "GET /api/events/:id returns single event with organizer details populated",
            resGetEvent.status === 200 && jsonGetEvent.data?.title === "Global Tech Summit 2026"
        );

        // Update event
        const resUpdateEvent = await fetch(`${BASE_URL}/api/events/${createdEventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${organizerToken}`
            },
            body: JSON.stringify({
                location: "Virtual Main Stage & Discord"
            })
        });
        const jsonUpdateEvent = await resUpdateEvent.json();
        recordTest(
            "PUT /api/events/:id updates event successfully",
            resUpdateEvent.status === 200 && jsonUpdateEvent.data?.location === "Virtual Main Stage & Discord"
        );

        // --- TEST 6: Bookings & Capacity Management (Week 6) ---
        console.log("\n--- 6. Bookings & Registrations (CRUD & Capacity) ---");
        const resBooking = await fetch(`${BASE_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${participantToken}`
            },
            body: JSON.stringify({
                eventId: createdEventId,
                ticketQuantity: 2,
                notes: "Excited to attend!"
            })
        });
        const jsonBooking = await resBooking.json();
        createdBookingId = jsonBooking.data?._id;
        recordTest(
            "POST /api/bookings registers participant for event",
            resBooking.status === 201 && !!createdBookingId,
            `Booking ID: ${createdBookingId}`
        );

        // Check event registeredCount incremented
        const resCheckEvent = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
        const jsonCheckEvent = await resCheckEvent.json();
        recordTest(
            "Event registeredCount atomically incremented to 2",
            jsonCheckEvent.data?.registeredCount === 2
        );

        // Prevent duplicate registration
        const resDupBooking = await fetch(`${BASE_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${participantToken}`
            },
            body: JSON.stringify({
                eventId: createdEventId,
                ticketQuantity: 1
            })
        });
        recordTest("POST /api/bookings prevents duplicate booking", resDupBooking.status === 400);

        // GET user's bookings
        const resMyBookings = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${participantToken}` }
        });
        const jsonMyBookings = await resMyBookings.json();
        recordTest(
            "GET /api/bookings/my-bookings retrieves participant's registrations",
            resMyBookings.status === 200 && jsonMyBookings.count >= 1
        );

        // Organizer retrieves attendee list for event
        const resAttendees = await fetch(`${BASE_URL}/api/bookings/event/${createdEventId}`, {
            headers: { Authorization: `Bearer ${organizerToken}` }
        });
        const jsonAttendees = await resAttendees.json();
        recordTest(
            "GET /api/bookings/event/:eventId returns registered attendee roster",
            resAttendees.status === 200 && jsonAttendees.count >= 1
        );

        // Cancel booking
        const resCancel = await fetch(`${BASE_URL}/api/bookings/${createdBookingId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${participantToken}` }
        });
        recordTest("DELETE /api/bookings/:id cancels registration", resCancel.status === 200);

        // Capacity restored
        const resCheckRestored = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
        const jsonCheckRestored = await resCheckRestored.json();
        recordTest(
            "Event registeredCount restored after cancellation",
            jsonCheckRestored.data?.registeredCount === 0
        );

        // --- TEST 7: Error Handling & Validation (Week 4) ---
        console.log("\n--- 7. Centralized Error Handling & Bad Requests ---");
        const resNotFound = await fetch(`${BASE_URL}/api/non-existent-route`);
        recordTest("404 handler returns structured JSON for unknown routes", resNotFound.status === 404);

        const resCastError = await fetch(`${BASE_URL}/api/events/invalid-mongo-id-12345`);
        recordTest("Global error handler catches CastError (invalid ID) and returns 400", resCastError.status === 400);

    } catch (err) {
        console.error("Test execution encountered an error:", err);
    } finally {
        if (server) {
            server.close();
            console.log("\n[Test Server] Closed cleanly.");
        }
        await mongoose.connection.close();
        console.log("[MongoDB] Connection closed.");

        console.log("\n==================================================");
        const passCount = results.filter((r) => r.passed).length;
        const totalCount = results.length;
        console.log(` Summary: ${passCount}/${totalCount} tests passed (${Math.round((passCount / totalCount) * 100)}%)`);
        console.log("==================================================\n");

        if (passCount !== totalCount) {
            process.exit(1);
        }
    }
}

runTests();
