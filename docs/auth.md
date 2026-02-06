# Authentication & Authorization (Planning)

This document describes the **planned authentication and authorization approach**
for the VHUB / Voluntr platform.

Authentication is **not implemented yet**.
This document exists to capture design intent and constraints before coding begins.

---

## Scope

This document covers:
- authentication concepts and responsibilities
- planned user roles
- high-level auth flow ideas

Out of scope:
- implementation details
- security hardening
- token expiration and refresh logic
- frontend auth handling

These will be addressed when auth is implemented.

---

## Core Principles

- Authentication logic belongs to the **backend**
- Passwords are never stored or returned in plain form
- The database does not “understand” passwords
- Auth-related logic will live primarily in the **service layer**
- Repositories only store and retrieve credential data

---

## Planned Actors

### Users
- Individuals who participate in events
- Authenticate using email + password
- Can browse events and manage participation

### Organizations
- Entities that create and manage events
- Authenticate using email + password
- Have a different set of permissions than users

### Admins (optional, future)
- Platform-level management
- Not implemented initially

---

## Password Handling

- Passwords are stored in the database as **strings**
- Password hashing will be handled by the application layer
- A hashing library (e.g. `bcrypt`) will be used
- Plain passwords will:
  - never be logged
  - never be returned by API responses
  - never be exposed outside the service layer

---

## Planned Authentication Flow (High-Level)

### Registration
1. Client sends email + password
2. Service hashes the password
3. Repository stores hashed password
4. Entity controls what data is exposed

### Login
1. Client sends email + password
2. Service retrieves user/org by email
3. Password hash is compared
4. On success, an auth token is issued

---

## Token-Based Authentication (Future)

- Authentication will likely use JWT (JSON Web Tokens)
- Tokens will be:
  - issued after successful login
  - sent via Authorization headers
- Token validation will be handled by middleware

This is intentionally deferred until core domain logic is stable.

---

## Authorization (High-Level)

- Authorization will be role-based
- Different roles will have access to different routes
- Authorization checks will occur:
  - after authentication
  - before business logic execution

Example (future):
- Only organizations can create events
- Users can only modify their own data

---

## Why Auth Is Deferred

Authentication is postponed intentionally because:
- core domain modeling must stabilize first
- premature auth increases complexity
- security decisions require careful design
- the platform must first prove its data flows

Auth will be introduced once:
- entities are stable
- repositories are DB-backed
- routes represent real use cases

---

## Notes

This document will evolve alongside implementation.

Any authentication-related code changes must be accompanied by updates to this document.
