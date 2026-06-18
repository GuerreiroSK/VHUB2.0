## Backend Folder Structure

apps/server/
├── src/
│   ├── routes/
│   │   ├── users.route.js
│   |   ├── events.route.js
│   |   ├── organizations.route.js
│   |   └── auth.route.js
|   |
│   ├── controllers/
│   │   ├── users.controller.js
│   |   ├── events.controller.js
│   |   ├── organizations.controller.js
│   |   ├── event_attendees.controller.js
│   |   └── auth.controller.js
|   |
│   ├── services/
│   │   ├── users.service.js
│   |   ├── events.service.js
│   |   ├── organizations.service.js
│   |   ├── event_attendees.service.js
│   |   └── auth.service.js
|   |
│   ├── repositories/
│   │   ├── users.repository.js
│   │   ├── events.repository.js
|   |   ├── organizations.repository.js
│   │   └── event_attendees.repository.js
|   |
│   ├── entities/
│   │   ├── User.js
│   │   ├── Event.js
|   |   ├── Organization.js
│   │   └── EventAttendee.js
|   |
|   ├── errors/
│   |   ├── NotFoundError.js
│   |   ├── ConflictError.js
│   |   └── UnauthorizedError.js
|   |
|   ├── middleware/
|   |   ├── role.middleware.js
│   |   └── auth.middleware.js
|   |
|   ├── scripts/
|   |   └── seed.js
|   |
│   ├── db/
│   │   └── index.js   ← Standalone dev tools, not part of the request-handling app
|   |
│   ├── app.js         ← Express app configuration (middleware, routes)
│   └── server.js      ← Application entry point
|  
├── package.json
├── package-lock.json
└── README.md


## Migrations

docs/migrations/
├── 001_add_soft_delete_and_event_dates.sql
├── 002_fix_events_organizations_fk.sql
├── 003_add_soft_delete_to_users.sql
├── 004_add_event_attendees_table.sql
└── 005_add_role_to_users.sql


## Backend Layered Architecture

- The backend follows a clean, layered architecture that enforces separation of concerns and allows infrastructure changes without affecting business logic.

### Flow
- HTTP request flow for a feature (example: Users):
route → controller → service → repository → database → entity → service → controller → response

### Layers and Responsbilities

- **Routes (`src/routes`)**
  - Define HTTP endpoints and paths
  - Delegate handling to controllers
  - Contain no business logic
  - Never handle `req`/`res` directly

- **Controllers (`src/controllers`)**
  - Handle HTTP concerns (`req`, `res`)
  - Call services
  - Await async operations
  - Send responses to the client
  - Contain no business or data-access logic

- **Services (`src/services`)**
  - Contain business logic
  - Coordinate application behavior
  - Call repositories
  - Decide what data is exposed (via entity methods)
  - Do not know about HTTP or databases

- **Repositories (`src/repositories`)**
  - Handle data access
  - Are the only layer that knows:
   - PostgreSQL exists
   - SQL exists
  - Use the shared DB pool
  - Map database rows into domain entities
  - Return entities, not raw database rows
  - Validate data before constructing entities to ensure domain integrity

- **Entities (`src/entities`)**
  - Represent domain concepts (User, Event, Organization)
  - Encapsulate identity and invariants
  - Control public data exposure ( e.g. toPublic() )
  - Know nothing about HTTP or databases

- **Middleware (`src/middleware`)**
  - Sits between routes and controllers
  - Intercepts requests before they reach controllers
  - Verifies JWT tokens and attaches `req.userId` and `req.userRole`
  - Returns 401 if token is missing or invalid — controller never runs

- **Database Module (`src/db`)**
 - Creates and exports a shared PostgreSQL connection pool
 - Read configuration from environment variables
 - Fails fast if configuration is missing
 - Is imported only by repositories

## Architectural Guarantees
  ### This structure ensures that:
  - Data sources can change ( mock -> PostgreSQL ) without refactoring routes or controllers
  - Sensitive fields ( e.g. passwords ) are never exposed accidentally
  - Async behavior propagates cleanly through the layers
  - Infrastructure concerns remain isolated from domain logic

  - Notes:
    - Collection repository methods return arrays (possibly empty), while singular methods throw if no data is found.
