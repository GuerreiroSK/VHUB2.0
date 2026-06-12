# API Routes

This document lists the backend API endpoints currently implemented in the project.

---

## Conventions

- Base URL (dev): http://localhost:3000
- All API routes are mounted under: /api
- Responses are JSON unless stated otherwise
- Current endpoints are test/demo endpoints used to validate architecture and data flow

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

- Example Requests:
  - POST /api/users

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
  - Password is stored as plain text for now — bcrypt hashing deferred to Phase 3 (auth)
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

  - 404 Not Found
    { "message": "User not found." }

  - 409 Conflict
    { "message": "This email already exists." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Empty strings are treated as no value — only truthy values are added to the update
  - Password stored as plain text for now — hashing deferred to Phase 3
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

- Behavior:
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

  - 404 Not Found
    { "message": "User not found" }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - Soft delete — sets deleted_at to NOW(), does not remove the row
  - Requires migration 003_add_soft_delete_to_users.sql to be applied first

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
  - If `id` is valid return events - 200 OK 
  - If `id` is invalid returns - 400 Bad Request
  - If `id` is valid but doesn't exist - 404 Not Found
  - If any error -> returns 500 Internal Server Error

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
  {
    "message": "id must be a positive integer"
  }  

  - 404 Not Found
  {
    "message": "Organization not found"
  }

  - 500 Internal Server Error
  { "message": "Internal Server Error." }

---

### POST /api/organizations

- Purpose:
  Create a new organization

- Method: POST

- URL:
  /api/organizations

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

  - 409 Conflict
    { "message": "This email already exists/registered" }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Password is not accepted — organizations don't authenticate directly
  - Users with organization roles will manage organizations after auth is implemented
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

- Body (JSON — all fields optional, at least one required):
  {
    "name": "Updated Org Name",
    "email": "new@org.com",
    "description": "Updated description",
    "location": "Porto"
  }

- Behavior:
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

  - 400 Bad Request
    { "message": "No fields were updated" }

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

- Behavior:
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
        "name": "Beach Cleanup",
        "location": "Carcavelos",
        "organizationId": 2,
        "email": "event@help.com"
      }
    ]

  - 400 Bad Request
    { "message": "page and limit must be positive integers (limit max 100)" }

  - 400 Bad Request
    { "message": "organizationId must be a positive integer" }

  - 404 Not Found
    { "message": "Organization not found." }

- Notes:
  - Controller validates query param format (string → number, positive integer)
  - Controller applies pagination defaults (page=1, limit=20) and cap (limit max 100)
  - Service enforces domain meaning (organization must exist when filtering)
  - Repository performs DB-side filtering and pagination (ORDER BY id LIMIT/OFFSET)
  - Returns DTOs via Event.toPublic()

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
      "name": "Beach Cleanup",
      "location": "Carcavelos",
      "organizationId": 2,
      "email": "event@help.com"
    }

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Event not found." }

- Notes:
  - Controller validates route param format (string → number, positive integer)
  - Service returns DTO via Event.toPublic()
  - Repository performs DB lookup (WHERE id = $1) and throws NotFoundError when missing

---

### GET /api/events/with-organizations

- Purpose:
  Retrieve all events enriched with their associated organization data

- Method: GET

- Response:
  [
    {
      "id": 1,
      "name": "Beach Cleanup",
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

  - 404 Not Found
    { "message": "Organization not found." }

  - 500 Internal Server Error
    { "message": "Internal server error." }

- Notes:
  - Events must belong to an organization — organizationId is required
  - Service checks organization exists before creating the event
  - organizationId will be derived from auth session in future auth implementation

  ---

  ### PATCH /api/events/:id

- Purpose:
  Partially update an existing event by its id

- Method: PATCH

- URL:
  /api/events/:id

- Route Params:
  - id (positive integer)

- Body (JSON — all fields optional, at least one required):
  {
    "name": "Updated Event Name",
    "location": "Porto",
    "email": "updated@event.com",
    "start_datetime": "2026-06-01T10:00:00",
    "end_datetime": "2026-06-01T14:00:00"
  }

- Behavior:
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

  - 400 Bad Request
    { "message": "No fields were updated" }

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

- Behavior:
  - If `id` is invalid (not a positive integer) → 400 Bad Request
  - If event does not exist or is already deleted → 404 Not Found
  - If successful → 204 No Content

- Example Requests:
  - DELETE /api/events/1
  - DELETE /api/events/abc
  - DELETE /api/events/9999

- Response:
  - 204 No Content (no body)

  - 400 Bad Request
    { "message": "id must be a positive integer" }

  - 404 Not Found
    { "message": "Event not found" }

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

- Body:
  {
    "userId": 1
  }

- Required Fields:
  - userId

- Behavior:
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

  - 404 Not Found
    { "message": "Event not found." }

  - 404 Not Found
    { "message": "User not found." }

  - 409 Conflict
    { "message": "This is already registered to this event." }

  - 500 Internal Server Error
    { "message": "Internal server error" }

- Notes:
  - userId will be derived from auth session in future auth implementation
  - Registration stored in event_attendees join table — no user details duplicated

  ---