# API Routes

This document lists the backend API endpoints currently implemented in the project.

---

## Conventions

- Base URL (dev): http://localhost:3000
- All API routes are mounted under: /api
- Responses are JSON unless stated otherwise
- Protected endpoints require a valid JWT token in the Authorization header
- Format: `Authorization: Bearer <token>`

---

## Users

### GET /api/users

- Purpose:
  Retrieve all registered users

- Method: GET

- URL:
  /api/users

- Behavior:
  - Returns all users as an array
  - Returns empty array if no users exist

- Response:
  - 200 OK
    [
      {
        "id": 1,
        "name": "João",
        "email": "joao@email.com"
      }
    ]

- Notes:
  - Password is never exposed — controlled by User.toPublic()
  - No pagination yet — will be addressed in a future iteration

---

### GET /api/users/:id

- Purpose:
  Retrieve a single user by their id

- Method: GET

- URL:
  /api/users/:id

- Route Params:
  - id (positive integer)

- Behavior:
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If no user exists for that id → 404 Not Found
  - If user exists → 200 OK

- Example Requests:
  - /api/users/1
  - /api/users/abc
  - /api/users/9999

- Response:
  - 200 OK
    {
      "id": 1,
      "name": "João",
      "email": "joao@email.com"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "User not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Password is never exposed — controlled by User.toPublic()
  - Controller validates format, service enforces domain meaning

---

### POST /api/users

- Purpose:
  Create a new user

- Method: POST

- URL:
  /api/users

- Body:
  {
    "name": "João Pedro",
    "email": "joao@mail.com",
    "password": "test123"
  }

- Required Fields:
  - name
  - email
  - password

- Behavior:
  - If name, email or password are missing → 400 Bad Request
  - If email already exists → 409 Conflict
  - If valid → 201 Created with user object

- Response:
  - 201 Created
    { "id": 1, "name": "João", "email": "joao@email.com" }

  - 400 Bad Request
    { "message": "Name, Email and Password fields cannot be empty" }

  - 409 Conflict
    { "message": "This email already exists/registered" }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Open endpoint — no token required (registration must be possible without being logged in)
  - Password is hashed with bcrypt before storage — plain text never stored
  - Password is never returned in the response

---

### PATCH /api/users/:id

- Purpose:
  Partially update an existing user

- Method: PATCH

- URL:
  /api/users/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Body:
  {
    "name": "João",
    "email": "joao@email.com",
    "password": "123456"
  }

- Optional Fields (send only what needs to change):
  - name
  - email
  - password

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If requesting user is not the target user → 401 Unauthorized
  - If id is not a positive integer → 400 Bad Request
  - If no valid fields in body → 400 Bad Request
  - If email already belongs to another user → 409 Conflict
  - If user not found → 404 Not Found
  - If valid → 200 OK with updated user object
  
- Example Requests:
  - PATCH /api/users/1
  - PATCH /api/users/abc

- Response:
  - 200 OK
    { "id": 1, "name": "João", "email": "joao@email.com" }

  - 400 Bad Request
    { "message": "id must be a positive integer" }
    { "message": "No fields were updated" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }
    { "message": "Unauthorized access" }   

  - 404 Not Found
    { "message": "User not found." }

  - 409 Conflict
    { "message": "This email already exists." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Empty strings are treated as no value — only truthy values are added to the update
  - Service checks user exists before email conflict check to ensure correct error priority

---

### DELETE /api/users/:id

- Purpose:
  Soft delete an existing user

- Method: DELETE

- URL:
  /api/users/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If requesting user is not the target user → 401 Unauthorized
  - If id is not a positive integer → 400 Bad Request
  - If user not found or already deleted → 404 Not Found
  - If valid → 204 No Content

- Example Requests:
  - DELETE /api/users/1
  - DELETE /api/users/abc

- Response:
  - 204 No Content

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }
    { "message": "Unauthorized access" }  

  - 404 Not Found
    { "message": "User not found" }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Soft delete — sets deleted_at to NOW(), does not remove the row

---

### GET /api/users/:id/events

- Purpose:
  Retrieve all events a specific user is registered to attend

- Method: GET

- URL:
  /api/users/:id/events

- Route Params:
  - id (positive integer) — the user ID

- Behavior:
  - If userId is not a positive integer → 400 Bad Request
  - If user does not exist → 404 Not Found
  - If user exists but has no registrations → 200 OK with empty array
  - If successful → 200 OK with array of events

- Example Requests:
  - GET /api/users/3/events
  - GET /api/users/abc/events
  - GET /api/users/9999/events

- Response:
  - 200 OK
    [
      {
        "id": 1,
        "eventName": "Beach Cleanup",
        "location": "Carcavelos",
        "organizationId": 1,
        "email": "event@help.com",
        "startDateTime": null,
        "endDateTime": null
      }
    ]

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "User not found." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Uses a SQL JOIN between event_attendees and events tables
  - Soft deleted registrations are excluded (event_attendees.deleted_at IS NULL)
  - Returns full event DTOs via Event.toPublic()
  - Route lives under /api/users — userId is the primary resource

---

## Organizations

### GET /api/organizations

- Purpose:
  Retrieve all organizations

- Method: GET

- URL:
  /api/organizations

- Behavior:
  - Returns all organizations as an array
  - Returns empty array if no organizations exist

- Response:
  - 200 OK
    [
      {
        "id": 1,
        "name": "Help Org",
        "email": "help@org.com",
        "description": "We help people",
        "location": "Lisbon"
      }
    ]

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - No pagination yet — will be addressed in a future iteration
  - Returns empty array when no organizations exist — absence of data is not an error

---

### GET /api/organizations/:id

- Purpose:
  Retrieve a single organization by its id

- Method: GET

- URL:
  /api/organizations/:id

- Route Params:
  - id (positive integer)

- Behavior:
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If no organization exists for that id → 404 Not Found
  - If organization exists → 200 OK

- Example Requests:
  - /api/organizations/1
  - /api/organizations/abc
  - /api/organizations/9999

- Response:
  - 200 OK
    {
      "id": 1,
      "name": "Help Org",
      "email": "help@org.com",
      "description": "Community Support",
      "location": "Lisbon"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Organization not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Controller validates format, service enforces domain meaning
  - NotFoundError thrown by repository, caught and mapped to 404 in controller

---

### GET /api/organizations/:id/events

- Purpose:
  Get all events by organization id

- Method: GET

- URL:
  /api/organizations/:id/events

- Route Params:
  - id (positive integer)

- Behavior:
  - If `id` is valid → return events 200 OK
  - If `id` is invalid → 400 Bad Request
  - If `id` is valid but doesn't exist → 404 Not Found
  - If any error → 500 Internal Server Error

- Example Requests:
  - /api/organizations/1/events
  - /api/organizations/-1/events
  - /api/organizations/abc/events
  - /api/organizations/9999/events

- Response:
  - 200 OK
    [
      {
        "id": 1,
        "eventName": "Beach Cleanup",
        "location": "Carcavelos",
        "organizationId": 1,
        "email": "event@help.com"
      }
    ]

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Organization not found" }

  - 500 Internal Server Error
    { "message": "Internal Server Error." }

---

### POST /api/organizations

- Purpose:
  Create a new organization

- Method: POST

- URL:
  /api/organizations

- Headers (required):
  Authorization: Bearer <token>

- Body (JSON):
  {
    "name": "Help Org",
    "email": "help@org.com",
    "description": "Community Support",
    "location": "Lisbon"
  }

- Required Fields:
  - name
  - email
  - location

- Optional Fields:
  - description

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If required fields are missing → 400 Bad Request
  - If email already exists → 409 Conflict
  - If successful → 201 Created with new organization

- Response:
  - 201 Created
    {
      "id": 2,
      "name": "Help Org",
      "email": "help@org.com",
      "description": "Community Support",
      "location": "Lisbon"
    }

  - 400 Bad Request
    { "message": "Name, Email and Location fields cannot be empty" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 409 Conflict
    { "message": "This email already exists/registered" }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Organizations don't authenticate directly
  - Controller validates required fields, service enforces email uniqueness

---

### PATCH /api/organizations/:id

- Purpose:
  Partially update an existing organization by its id

- Method: PATCH

- URL:
  /api/organizations/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Body (JSON — all fields optional, at least one required):
  {
    "name": "Updated Org Name",
    "email": "new@org.com",
    "description": "Updated description",
    "location": "Porto"
  }

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If body is empty (no fields provided) → 400 Bad Request
  - If email already belongs to another organization → 409 Conflict
  - If organization does not exist → 404 Not Found
  - If successful → 200 OK with updated organization

- Example Requests:
  - PATCH /api/organizations/1 with { "name": "New Name" }
  - PATCH /api/organizations/1 with {}
  - PATCH /api/organizations/9999 with { "name": "New Name" }

- Response:
  - 200 OK
    {
      "id": 1,
      "name": "Updated Org Name",
      "email": "help@org.com",
      "description": "Community Support",
      "location": "Lisbon"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }
    { "message": "No fields were updated" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "Organization not found." }

  - 409 Conflict
    { "message": "This email already exists/registered" }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - PATCH used instead of PUT — partial updates only, send only fields to change
  - Email uniqueness check skips the current organization to allow same-email updates
  - Dynamic SQL built in repository using Object.entries()

---

### DELETE /api/organizations/:id

- Purpose:
  Soft delete an organization by its id

- Method: DELETE

- URL:
  /api/organizations/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If user role is not admin → 401 Unauthorized
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If organization does not exist → 404 Not Found
  - If successful → 204 No Content

- Example Requests:
  - DELETE /api/organizations/1
  - DELETE /api/organizations/abc
  - DELETE /api/organizations/9999

- Response:
  - 204 No Content (no body)

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }
    { "message": "Unauthorized Access." }

  - 404 Not Found
    { "message": "Organization not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Soft delete — sets deleted_at timestamp, data is preserved
  - Deleted organizations are excluded from all GET queries
  - Hard delete not used — data retained for analytics and recovery

---

## Events

### GET /api/events

- Purpose:
  List events (paginated), optionally filtered by organization

- Method: GET

- URL:
  /api/events

- Optional Query Params:
  - page (positive integer, default: 1)
  - limit (positive integer, default: 20, max: 100)
  - organizationId (positive integer)

- Behavior:
  - If `page` or `limit` is invalid → 400 Bad Request
  - If `organizationId` is missing → returns paginated events (page/limit)
  - If `organizationId` is invalid (not a positive integer) → 400 Bad Request
  - If `organizationId` is valid but organization does not exist → 404 Not Found
  - If organization exists but has no events → returns empty array

- Example Requests:
  - /api/events
  - /api/events?page=2&limit=10
  - /api/events?organizationId=2&page=1&limit=10

- Response:
  - 200 OK
    [
      {
        "id": 1,
        "eventName": "Beach Cleanup",
        "location": "Carcavelos",
        "organizationId": 2,
        "email": "event@help.com"
      }
    ]

  - 400 Bad Request
    { "message": "page and limit must be positive integers (limit max 100)" }
    { "message": "organizationId must be a positive integer" }

  - 404 Not Found
    { "message": "Organization not found." }

- Notes:
  - Controller validates query param format (string → number, positive integer)
  - Controller applies pagination defaults (page=1, limit=20) and cap (limit max 100)
  - Service enforces domain meaning (organization must exist when filtering)
  - Repository performs DB-side filtering and pagination (ORDER BY id LIMIT/OFFSET)

---

### GET /api/events/:id

- Purpose:
  Retrieve a single event by its id

- Method: GET

- URL:
  /api/events/:id

- Route Params:
  - id (positive integer)

- Behavior:
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If no event exists for that id → 404 Not Found
  - If event exists → 200 OK with the event DTO

- Example Requests:
  - /api/events/1
  - /api/events/99999

- Response:
  - 200 OK
    {
      "id": 1,
      "eventName": "Beach Cleanup",
      "location": "Carcavelos",
      "organizationId": 2,
      "email": "event@help.com"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Event not found." }

---

### GET /api/events/with-organizations

- Purpose:
  Retrieve all events enriched with their associated organization data

- Method: GET

- Response:
  [
    {
      "id": 1,
      "eventName": "Beach Cleanup",
      "location": "Carcavelos",
      "email": "event@help.com",
      "organization": {
        "id": 1,
        "name": "Help Org",
        "email": "help@org.com"
      }
    }
  ]

- Notes:
  - Data is composed in the service layer
  - Combines Event and Organization entities
  - Returns empty array if no events exist

---

### POST /api/events

- Purpose:
  Create a new event linked to an organization

- Method: POST

- URL:
  /api/events

- Headers (required):
  Authorization: Bearer <token>

- Body (JSON):
  {
    "eventName": "Beach Cleanup",
    "location": "Carcavelos",
    "email": "event@help.com",
    "organizationId": 1
  }

- Required Fields:
  - eventName
  - location
  - email
  - organizationId

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If any required field is missing → 400 Bad Request
  - If organization does not exist → 404 Not Found
  - If successful → 201 Created with new event

- Response:
  - 201 Created
    {
      "id": 2,
      "eventName": "Beach Cleanup",
      "location": "Carcavelos",
      "organizationId": 1,
      "email": "event@help.com"
    }

  - 400 Bad Request
    { "message": "Name, Email, Location and Organization ID fields cannot be empty" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "Organization not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Events must belong to an organization — organizationId is required
  - Service checks organization exists before creating the event

---

### PATCH /api/events/:id

- Purpose:
  Partially update an existing event by its id

- Method: PATCH

- URL:
  /api/events/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Body (JSON — all fields optional, at least one required):
  {
    "name": "Updated Event Name",
    "location": "Porto",
    "email": "updated@event.com",
    "start_datetime": "2026-06-01T10:00:00",
    "end_datetime": "2026-06-01T14:00:00"
  }

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If body is empty (no fields provided) → 400 Bad Request
  - If event does not exist → 404 Not Found
  - If successful → 200 OK with updated event

- Example Requests:
  - PATCH /api/events/1 with { "name": "New Name" }
  - PATCH /api/events/1 with {}
  - PATCH /api/events/9999 with { "name": "New Name" }

- Response:
  - 200 OK
    {
      "id": 1,
      "eventName": "New Name",
      "location": "Carcavelos",
      "organizationId": 2,
      "email": "event@help.com",
      "startDateTime": null,
      "endDateTime": null
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }
    { "message": "No fields were updated" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "Event not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - organizationId is not updatable — events cannot change organization ownership
  - start_datetime and end_datetime are sent as ISO 8601 strings
  - PATCH used for partial updates — send only fields to change

---

### DELETE /api/events/:id

- Purpose:
  Soft delete an event by its id

- Method: DELETE

- URL:
  /api/events/:id

- Route Params:
  - id (positive integer)

- Headers (required):
  Authorization: Bearer <token>

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If event does not exist or is already deleted → 404 Not Found
  - If successful → 204 No Content

- Example Requests:
  - DELETE /api/events/1
  - DELETE /api/events/abc
  - DELETE /api/events/9999

- Response:
  - 204 No Content

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "Event not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Soft delete — sets deleted_at timestamp, data is preserved
  - Deleted events are excluded from all GET queries
  - Hard delete not used — data retained for analytics and recovery

---

### POST /api/events/:id/attendees

- Purpose:
  Register a user to an event

- Method: POST

- URL:
  /api/events/:id/attendees

- Route Params:
  - id (positive integer) — the event ID

- Headers (required):
  Authorization: Bearer <token>

- Body:
  {
    "userId": 1
  }

- Required Fields:
  - userId

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If eventId is not a positive integer → 400 Bad Request
  - If userId is not a positive integer → 400 Bad Request
  - If event does not exist → 404 Not Found
  - If user does not exist → 404 Not Found
  - If user is already registered to this event → 409 Conflict
  - If successful → 201 Created with registration object

- Example Requests:
  - POST /api/events/1/attendees with { "userId": 3 }
  - POST /api/events/abc/attendees
  - POST /api/events/9999/attendees with { "userId": 3 }

- Response:
  - 201 Created
    {
      "userId": 3,
      "eventId": 1,
      "createdAt": "2026-06-12T09:38:20.131Z"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "Event not found." }
    { "message": "User not found." }

  - 409 Conflict
    { "message": "This is already registered to this event." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Registration stored in event_attendees join table — no user details duplicated

---

### GET /api/events/:id/attendees

- Purpose:
  Retrieve all attendees registered to a specific event

- Method: GET

- URL:
  /api/events/:id/attendees

- Route Params:
  - id (positive integer) — the event ID

- Behavior:
  - If eventId is not a positive integer → 400 Bad Request
  - If event does not exist → 404 Not Found
  - If event exists but has no attendees → 200 OK with empty array
  - If successful → 200 OK with array of registrations

- Example Requests:
  - GET /api/events/1/attendees
  - GET /api/events/abc/attendees
  - GET /api/events/9999/attendees

- Response:
  - 200 OK
    [
      {
        "userId": 3,
        "eventId": 1,
        "createdAt": "2026-06-12T09:38:20.131Z"
      }
    ]

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Event not found." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Returns empty array if event exists but has no attendees
  - Soft deleted registrations are excluded (deleted_at IS NULL)
  - Service verifies event exists before querying attendees

---

### DELETE /api/events/:id/attendees/:userId

- Purpose:
  Cancel a user's registration to a specific event (soft delete)

- Method: DELETE

- URL:
  /api/events/:id/attendees/:userId

- Route Params:
  - id (positive integer) — the event ID
  - userId (positive integer) — the user ID

- Headers (required):
  Authorization: Bearer <token>

- Behavior:
  - If Authorization header is missing → 401 Unauthorized
  - If token is invalid or expired → 401 Unauthorized
  - If eventId is not a positive integer → 400 Bad Request
  - If userId is not a positive integer → 400 Bad Request
  - If event does not exist → 404 Not Found
  - If user does not exist → 404 Not Found
  - If registration does not exist or already cancelled → 404 Not Found
  - If successful → 204 No Content

- Example Requests:
  - DELETE /api/events/1/attendees/3
  - DELETE /api/events/abc/attendees/3
  - DELETE /api/events/1/attendees/9999

- Response:
  - 204 No Content (no body)

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 401 Unauthorized
    { "message": "No token provided." }
    { "message": "Invalid token." }

  - 404 Not Found
    { "message": "User not found." }
    { "message": "Event not found." }
    { "message": "Registration not found" }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Soft delete — sets deleted_at to NOW(), registration row is preserved
  - Service checks user and event exist before attempting the update
  - Repository uses rowCount to detect if registration existed

---

## Auth

### POST /api/auth/login

- Purpose:
  Authenticate a user with email and password

- Method: POST

- URL:
  /api/auth/login

- Body:
  {
    "email": "user1@email.com",
    "password": "123"
  }

- Required Fields:
  - email
  - password

- Behavior:
  - If email or password missing → 400 Bad Request
  - If email not found → 404 Not Found
  - If password incorrect → 401 Unauthorized
  - If both match → 200 OK with user object and JWT token

- Example Request:
  POST /api/auth/login

- Response:
  - 200 OK
    {
      "id": 1,
      "name": "User1",
      "email": "user1@email.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

  - 400 Bad Request
    { "message": "Email and Password fields cannot be empty." }

  - 401 Unauthorized
    { "message": "Unauthorized access." }

  - 404 Not Found
    { "message": "User not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Open endpoint — no token required
  - Password is never returned in the response — toPublic() strips it
  - Token payload contains only { id } — payload is public, never put sensitive data in it
  - Token expires after 24h