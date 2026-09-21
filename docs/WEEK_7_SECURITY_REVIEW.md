# Week 7 Deliverable: Authentication & Security Review

This document details the security architecture, password hashing mechanism, authentication lifecycle, and formal security review for the **Online Event Management System**.

---

## 1. Authentication Architecture

The system implements a stateless, token-based authentication mechanism using **JSON Web Tokens (JWT)** and **bcrypt** password hashing.

```
+----------------+              +-------------------+              +------------------+
|   HTTP Client  |              | Express / Backend |              |  MongoDB Server  |
+----------------+              +-------------------+              +------------------+
       |                                  |                                  |
       |  POST /api/auth/register         |                                  |
       |  { name, email, password }       |                                  |
       |--------------------------------->|  1. Validate Inputs              |
       |                                  |  2. Check existing email         |
       |                                  |  3. bcrypt.hash(pass, 10 salt)   |
       |                                  |  4. Save User document --------->|
       |                                  |  5. Generate JWT token           |
       |  201 Created { user, token }     |                                  |
       |<---------------------------------|                                  |
       |                                  |                                  |
       |  POST /api/auth/login            |                                  |
       |  { email, password }             |                                  |
       |--------------------------------->|  1. Fetch user +password ------->|
       |                                  |  2. bcrypt.compare(pass, hash)   |
       |                                  |  3. Generate JWT token           |
       |  200 OK { user, token }          |                                  |
       |<---------------------------------|                                  |
       |                                  |                                  |
       |  GET /api/events (Protected)     |                                  |
       |  Header: "Bearer <token>"        |                                  |
       |--------------------------------->|  1. jwt.verify(token, secret)    |
       |                                  |  2. Attach req.user              |
       |                                  |  3. Role check (authorize)       |
       |  200 OK / 403 Forbidden          |                                  |
       |<---------------------------------|                                  |
```

---

## 2. Password Hashing (Bcrypt) Implementation

- **Library:** `bcryptjs`
- **Cost Factor / Salt Rounds:** `10`
- **One-Way Cryptographic Function:** Uses Blowfish-based adaptive hashing algorithm with work factor.
- **Hook Integration:** Implemented cleanly via Mongoose `pre('save')` lifecycle hook in `models/userModel.js`:
  ```javascript
  userSchema.pre("save", async function () {
      if (!this.isModified("password")) return;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  });
  ```
- **Password Exclusion:** Password hash is defined with `{ select: false }` to prevent accidental inclusion in MongoDB queries and JSON serialization:
  ```javascript
  userSchema.methods.toJSON = function () {
      const obj = this.toObject();
      delete obj.password;
      return obj;
  };
  ```

---

## 3. Token Security & Lifecycle

- **Signing Algorithm:** HMAC SHA-256 (`HS256`)
- **Secret Key:** Stored strictly in environment variables (`JWT_SECRET`) and excluded from version control via `.gitignore`.
- **Token Expiry:** Defaults to `7d` via `JWT_EXPIRES_IN`.
- **Payload Contents:** Limited to essential identifiers (`id`, `role`) with zero sensitive credentials.
- **Header Transport:** Transported over standard HTTP Authorization header: `Authorization: Bearer <token>`.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Endpoint | Method | Public | User | Organizer | Admin |
|---|---|:---:|:---:|:---:|:---:|
| `/api/auth/register` | POST | ✓ | ✓ | ✓ | ✓ |
| `/api/auth/login` | POST | ✓ | ✓ | ✓ | ✓ |
| `/api/auth/me` | GET | ✗ | ✓ | ✓ | ✓ |
| `/api/events` (list) | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/events/:id` | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/events` (create) | POST | ✗ | ✗ | ✓ | ✓ |
| `/api/events/:id` (update)| PUT | ✗ | ✗ | ✓ (Owner) | ✓ |
| `/api/events/:id` (delete)| DELETE | ✗ | ✗ | ✓ (Owner) | ✓ |
| `/api/bookings` (create) | POST | ✗ | ✓ | ✓ | ✓ |
| `/api/bookings/my-bookings`| GET | ✗ | ✓ | ✓ | ✓ |
| `/api/bookings/event/:id`| GET | ✗ | ✗ | ✓ | ✓ |
| `/api/users` (list) | GET | ✗ | ✗ | ✗ | ✓ |

---

## 5. Security Checklist & Code Review

| Check Item | Status | Verification Detail |
|---|:---:|---|
| **Password Hashing** | PASS | Hashed with bcrypt (10 rounds); plaintext password never stored |
| **Password Leakage Prevention** | PASS | `select: false` on schema, password stripped in `toJSON()` |
| **NoSQL Injection Resistance** | PASS | Mongoose Schema strict typing and sanitization |
| **Input Validation** | PASS | Email regex, minimum lengths, positive integers enforced |
| **JWT Verification** | PASS | `jwt.verify` validated in `authMiddleware.js` on protected routes |
| **Role Authorization** | PASS | `authorize('organizer', 'admin')` guards privileged operations |
| **Environment Variable Safety** | PASS | `.env` file ignored via `.gitignore`; `.env.example` provided |
| **CORS Policy** | PASS | Configured using `cors()` middleware in `app.js` |
| **Centralized Error Formatting**| PASS | Stack traces suppressed in production mode (`NODE_ENV=production`) |
| **Resource Ownership Verification**| PASS | Organizers can only modify or delete events they created |
| **Duplicate Booking Prevention**| PASS | Mongoose unique compound index on `{ event: 1, user: 1 }` |
