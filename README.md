# VHUB2.0
VHUB (Volunteer Hub) is a fullstack volunteering platform designed to connect volunteers with organizations and events.

This project is being developed as a learning-focused, real-world engineering exercise with strong emphasis on backend architecture, clean code, and system design principles.

---

## 🚀 Project Goals

- Build a real-world fullstack application from scratch
- Practice clean architecture and separation of concerns
- Learn how to design scalable backend systems
- Develop strong engineering habits (not tutorial-based coding)
- Maintain professional documentation and Git workflows

---

## 🧠 Core Concepts Practiced

- Layered backend architecture
- Repository pattern
- Domain entities and data encapsulation
- Service-layer composition
- Async/await and promise flow
- API design and consistency
- Data transformation and mapping
- Separation of concerns
- Documentation discipline

---

## 🏗️ Project Structure (Monorepo)

VHUB2.0/

- apps/
  - client/        → React + Vite + TypeScript + Tailwind
  - server/        → Node.js + Express (ESM)
- docs/            → Architecture, decisions, learning notes
- README.md

---

## 🔧 Backend Architecture

The backend follows a strict layered architecture:

route → controller → service → repository → database → entity → service → controller → response

### Responsibilities

- Routes
  - Define endpoints only
  - No logic

- Controllers
  - Handle HTTP (req/res)
  - Call services
  - Return responses

- Services
  - Business logic
  - Orchestrate data
  - Compose multiple entities
  - Shape API responses (DTOs)

- Repositories
  - Data access only
  - Contain SQL
  - Map database rows → entities
  - Never compose multiple entities

- Entities
  - Represent domain concepts
  - Encapsulate data and rules
  - Control public data exposure (`toPublic()`)

---

## 🧠 Key Engineering Principles

- Repositories fetch data
- Services compose data
- Controllers expose data

- Arrays are not entities
- Only entities have behavior (e.g. `toPublic()`)

- Use `map()` to transform collections
- Use lookup maps for efficient relations

- Never leak raw database rows
- Keep naming consistent across the domain

---

## 📦 Domain Model

- User
  - id, name, email, password
  - Handles authentication (future)

- Organization
  - id, name, email, description, location

- Event
  - id, eventName, location, organizationId, email

---

## 🗄️ Database

- PostgreSQL
- Tables:
  - users
  - organizations
  - events

- Relationships:
  - events.organization_id → organizations.id

- Naming:
  - Database: snake_case
  - Application: camelCase

---

## 🔌 API Overview

Base URL: http://localhost:3000/api

### Users
- GET /users/test
- GET /users

### Organizations
- GET /organizations/organization_test
- GET /organizations

### Events
- GET /events/event_test
- GET /events
- GET /events/with-organizations

---

## 🔥 Example Feature

### Events with Organizations

Endpoint:
GET /api/events/with-organizations

Description:
Returns events enriched with their associated organization data.

Implemented using:
- Service-layer composition
- Lookup map pattern
- DTO (Data Transfer Object)

---

## 🌿 Git Workflow

- main branch is always stable
- Work is done in feature branches

Flow:
create branch → implement → commit → update docs → PR → merge

---

## 📄 Documentation

Documentation is treated as a first-class concern.

Located in:
docs/

Includes:
- architecture.md
- routes.md
- db-schema.md
- setup-guide.md
- decisions.md
- learning notes (day-by-day)

---

## 🚫 Authentication (Planned)

Authentication is intentionally not implemented yet.

Planned features:
- Password hashing
- Login system
- Role-based access control

---

## 🎯 Current Focus

- Backend architecture mastery
- Data composition and transformation
- Clean separation of concerns
- Building real engineering thinking

---

## 👨‍💻 Author

João Pedro Guerreiro

---

## 📈 Status

Active development — evolving alongside learning progress
