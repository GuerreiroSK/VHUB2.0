## Backend Folder Structure

apps/server/
├── src/
│   ├── routes/
│   │   ├── users.route.js
│   │   ├── events.route.js
│   │   └── organizations.route.js
│   ├── controllers/
│   │   ├── users.controller.js
│   │   ├── events.controller.js
│   │   └── organizations.controller.js
│   ├── services/
│   │   ├── users.service.js
│   │   ├── events.service.js
│   │   └── organizations.service.js
│   ├── repositories/
│   │   ├── users.repository.js
│   │   ├── events.repository.js
│   │   └── organizations.repository.js
│   ├── entities/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Organization.js
│   ├── db/
│   │   └── index.js
│   ├── app.js        ← Express app configuration (middleware, routes)
│   └── server.js     ← Application entry point
├── package.json
├── package-lock.json
└── README.md


## Backend Layered Architecture

- The backend follows a clean, layered architecture that enforces separation of concerns and allows infrastructure changes without affecting business logic.

### Flow
- HTTP request flow for a feature (example: Users):
route → controller → service → repository → database → entity → service → controller → response

### Layers and Responsabilities

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
  - Map databse rows to domain entities
  - Return entities, not raw database rows

- **Entities (`src/entities`)**
  - Represent domain concepts (User, Event, Organization)
  - Encapsulate identity and invariants
  - Control public data exposure ( e.g. toPublic() )
  - Know nothing about HTTP or databases

- **Database Module (`src/db`)**
 - Creates and exports a shared PostgreSQL connection pool
 - Read configuration from environment variables
 - Fails fast if configuration is missing
 - Is imported only by repositories

## Architectural Guarantees
  ### This structure ensures that:
  - Data sources can change ( mock -> PostegreSQL ) without refactoring routes or controllers
  - Sensitive fields ( e.g. passwords ) are never exposed accidentally
  - Async behavior propagates cleanly through the layers
  - Infrastructure concerns remain isolated from domain logic