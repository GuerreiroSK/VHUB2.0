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

- Returns all events
- Returns empty array if no events exist

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


