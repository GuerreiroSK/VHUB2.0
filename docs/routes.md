# API Routes

This document lists the backend API endpoints currently implemented in the project.

## Conventions
- Base URL (dev): `http://localhost:3000`
- All API routes are mounted under: `/api`
- Responses are JSON unless stated otherwise.

---

## Users

### `GET /api/users/user_test`
- **Purpose**: Verify users router is mounted and working
- **Method**: `GET`
- **URL**: `/api/users/user_test`
- **Response**:
  ```json
  { "message": "User route working" }

## Organizations

### `GET /api/organizations/organization_test`
- **Purpose**: Verify organizations router is mounted and working
- **Method**: `GET`
- **URL**: `/api/organizations/organization_test`
- **Response**:
  ```json
  { "message": "Organization route working" }

## Events

### `GET /api/events/event_test`
- **Purpose**: Verify events router is mounted and working
- **Method**: `GET`
- **URL**: `/api/events/event_test`
- **Response**:
  ```json
  { "message": "Event route working" }