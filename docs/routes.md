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

### GET /api/users/test

- Purpose:
  Verify the users vertical slice (route → controller → service → repository → database)

- Method: GET

- URL:
  /api/users/test

- Response:
  {
    "id": 1,
    "name": "João",
    "email": "joao@email.com"
  }

- Notes:
  - Data is fetched from PostgreSQL
  - Sensitive fields (e.g. password) are not exposed
  - Response is produced via the User.toPublic() entity method

---

### GET /api/users

- Returns all users
- Returns empty array if no users exist

---

## Organizations

### GET /api/organizations/organization_test

- Purpose:
  Verify the organizations vertical slice (route → controller → service → repository → database)

- Method: GET

- URL:
  /api/organizations/organization_test

- Response:
  { "message": "Organization route working" }

- Notes:
  - Data is fetched from PostgreSQL
  - Response is constructed via Organization entity

---

### GET /api/organizations

- Returns all organizations
- Returns empty array if no organizations exist

---

## Events

### GET /api/events/event_test

- Purpose:
  Verify the events vertical slice (route → controller → service → repository → database)

- Method: GET

- URL:
  /api/events/event_test

- Response:
  { "message": "Event route working" }

- Notes:
  - Data is fetched from PostgreSQL
  - Response is constructed via Event entity

---

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