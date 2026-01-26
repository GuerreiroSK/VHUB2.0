## Backend Folder Structure

apps/server/
├── src/
│   ├── routes/
│   │   └── events.js            ← Modular route file for /api/events
│   │   └── organizations.js     ← Modular route file for /api/organizations
│   │   └── users.js             ← Modular route file for /api/users
│   ├── app.js                   ← Sets up middleware, mounts routers
│   └── server.js                ← Starts the server (TBD)
├── package.json                 ← Project metadata and scripts
├── package-lock.json            ← Lockfile for dependency versions
├── README.md                    ← Project documentation


## Backend Layered Architecture (Routes → Controllers → Services → Repositories)

The backend follows a clean, layered architecture to separate responsibilities and improve scalability.

### Flow
HTTP request flow for a feature (example: Users):

route → controller → service → repository → data → response

### Layers

- **Routes (`src/routes`)**
  - Define HTTP endpoints and paths
  - Delegate handling to controllers
  - Contain no business logic

- **Controllers (`src/controllers`)**
  - Handle HTTP concerns (`req`, `res`)
  - Call services
  - Send responses to the client

- **Services (`src/services`)**
  - Contain business logic
  - Coordinate application behavior
  - Return plain data (no HTTP, no DB details)

- **Repositories (`src/repositories`)**
  - Handle data access
  - Currently return mock data
  - Will later contain database queries

This structure allows easy replacement of the data layer (mock → database) without refactoring routes or controllers.
