## Project Stack & Decisions

### Frontend

- React + Vite + TypeScript
- TailwindCSS for styling
- Why: Modern stack, fast development, easy styling with utility-first classes, and type safety.

### Backend
- Node.js + Express
- Why: Lightweight, fast setup, flexible API development.

### Backend Dependencies
- cors: Needed to allow frontend to access backend across ports during development.
- dotenv: Keeps secrets and configuration out of the source code.
- express: Simple and fast web server to expose REST APIs.
- nodemon(dev only): Automatically reloads the server when changes are made.

### Database
- PostgreSQL
- Why: Open-source, scalable, relational integrity.

### Architecture
- Monorepo structure
- Why: Easier to manage as solo dev, can scale to multi-repo later.

### Tools
- DBeaver for visual DB modeling.
- Postman for API testing.
- Docker for consistent development environment.
- Git + GitHub for version control.

### Key Dev Decisions
- Using .cjs(CommonJS) for configuration files due to ESM project and compatibility issues.
- Started with frontend to ensure UI/UX vision is solid before backend.
- Documenting from day 1 to track choices, changes, and architecture.