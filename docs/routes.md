# API Routes

This document lists the backend API endpoints currently implemented in the project.

---

## Conventions

- Base URL (dev): `http://localhost:3000`
- All API routes are mounted under: `/api`
- Responses are JSON unless stated otherwise
- Current endpoints are **test/demo endpoints** used to validate architecture and data flow

---

## Users

### `GET /api/users/test`

- **Purpose**:  
  Verify the users vertical slice (route → controller → service → repository → database)

- **Method**: `GET`

- **URL**:  
  `/api/users/test`

- **Response**:
  ```json
  {
    "id": 1,
    "name": "João",
    "email": "joao@email.com"
  }

- Notes:
  - Data is fetched from PostgreSQL
  - Sensitive fields ( e.g. password ) are not exposed
  - Response is produced via the User.toPublic() entity method

---

## Organizations

### `GET /api/organizations/organization_test`
- **Purpose**: Verify organizations routing and service wiring
- **Method**: `GET`
- **URL**: `/api/organizations/organization_test`
- **Response**:
  ```json
  { "message": "Organization route working" }

- Notes:
  - Currently uses mock data
  - Will later be backed by PostgreSQL

---   

## Events

### `GET /api/events/event_test`
- **Purpose**: Verify events routing and service wiring
- **Method**: `GET`
- **URL**: `/api/events/event_test`
- **Response**:
  ```json
  { "message": "Event route working" }

- Notes:
  - Currently uses mock data
  - Will later be backed by PostgreSQL