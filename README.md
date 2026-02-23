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
