# API Routes

This document lists the backend API endpoints currently implemented in the project.

## Conventions
- Base URL (dev): `http://localhost:3000`
- All API routes are mounted under: `/api`
- Responses are JSON unless stated otherwise.

---

## Users

### `GET /api/users/test`
- **Purpose**: Verify users router is mounted and working
- **Method**: `GET`
- **URL**: `/api/users/test`
- **Response**:
  ```json
  { "message": "users route working" }

## Organizations

### `GET /api/organizations/test`
- **Purpose**: Verify organizations router is mounted and working
- **Method**: `GET`
- **URL**: `/api/organizations/test`
- **Response**:
  ```json
  { "message": "organizations route working" }

## Events

### `GET /api/events/test`
- **Purpose**: Verify events router is mounted and working
- **Method**: `GET`
- **URL**: `/api/events/test`
- **Response**:
  ```json
  { "message": "events route working" }