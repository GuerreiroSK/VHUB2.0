## Project Decisions & Rationale

This document records **key technical and architectural decisions**
made during the development of the VHUB / Voluntr project.

Its purpose is to explain *why* choices were made, not just *what* was chosen.
This document evolves alongside the codebase.

---

## Monorepo Structure

**Decision**  
Use a single monorepo containing frontend and backend applications.

**Why**
- Easier coordination as a solo developer
- Shared documentation and version control
- Simplifies early-stage development

**Trade-off**
- Can be split into multiple repositories later if team size or deployment strategy changes

---

## Frontend Stack

**Decision**  
Use React + Vite + TypeScript with TailwindCSS.

**Why**
- Fast development and build times (Vite)
- Type safety (TypeScript)
- Utility-first styling reduces CSS complexity (Tailwind)

---

## Backend Stack

**Decision**  
Use Node.js with Express, fully in ESM.

**Why**
- Lightweight and flexible
- Large ecosystem
- Good balance between simplicity and control
- ESM aligns with modern JavaScript standards

---

## Backend Architecture: Clean Layered Design

**Decision**  
Adopt a clean, layered backend architecture:

routes → controllers → services → repositories → data source

**Why**
- Enforces separation of concerns
- Makes business logic independent from infrastructure
- Allows data source replacement without refactoring upper layers

**Result**
- Mock data was replaced by PostgreSQL with minimal changes
- Architecture proved resilient under real I/O

---

## Entities as Domain Models

**Decision**  
Introduce entities (e.g. `User`, `Event`, `Organization`) as classes.

**Why**
- Represent identity and domain concepts explicitly
- Prevent raw database rows from leaking into the application
- Centralize domain rules

**Example**
- `User.toPublic()` ensures sensitive data (passwords) are never exposed

---

## Database Choice: PostgreSQL

**Decision**  
Use PostgreSQL as the primary database.

**Why**
- Strong relational integrity
- Foreign key enforcement
- Production-grade and widely adopted

**Trade-off**
- Higher setup complexity compared to in-memory or file-based databases
- Requires understanding clusters, roles, and permissions

---

## Database Access via Repositories

**Decision**  
Restrict all database access to repository files.

**Why**
- Keeps SQL isolated from business logic
- Makes repositories replaceable
- Aligns with clean architecture principles

Repositories return **entities**, not raw database rows.

---

## Fail-Fast Environment Configuration

**Decision**  
Validate required environment variables at application startup.

**Why**
- Prevents undefined runtime behavior
- Makes configuration errors explicit
- Avoids partially running systems

The application crashes early if DB configuration is missing.

---

## Async Propagation Awareness

**Decision**  
Allow async behavior to propagate naturally through layers.

**Why**
- Database access is inherently async
- Services and controllers must explicitly `await` results
- Prevents subtle bugs (e.g. returning Promises to Express)

**Lesson**
- Async boundaries must be respected at every layer

---

## Authentication Deferred Intentionally

**Decision**  
Delay authentication implementation.

**Why**
- Core domain modeling needed to stabilize first
- Authentication adds significant complexity
- Security decisions require careful design

Auth planning is documented separately in `docs/auth.md`.

---

## Git Workflow: Feature Branches & Pull Requests

**Decision**  
Adopt a disciplined Git workflow:

feature branch → commit → pull request → merge

**Why**
- Keeps main branch stable
- Encourages scoped, reviewable changes
- Produces a readable project history

A pull request template was added to reinforce this habit.

---

## Documentation as a First-Class Concern

**Decision**  
Update documentation alongside code changes.

**Why**
- Prevents documentation from becoming outdated
- Reinforces architectural understanding
- Serves as long-term reference and portfolio material

Docs are treated as part of the deliverable, not an afterthought.

---

## Tooling Choices

- **DBeaver**: visual database inspection and schema management
- **Postman**: API testing and validation
- **Git & GitHub**: version control and collaboration
- **Docker (planned)**: consistent environments across machines

---

## Separation of Authentication from Domain Entities

**Decision**  
Remove authentication concerns (e.g. passwords) from the `Organization` domain entity.  
Only `User` entities will own authentication credentials.

**Why**
- Authentication is a separate concern from core domain modeling
- Organizations represent resources, not actors that prove identity
- Users (people) perform actions on behalf of organizations
- This enables clear role-based access control (e.g. volunteer, organization employee, admin, developer)
- Prevents sensitive data from leaking into domain models or API contracts

**Result**
- `Organization` entity now contains only domain-relevant fields
- Repository layer was the first to fail, correctly exposing invalid assumptions
- Authentication responsibilities are isolated and can evolve independently
- System actions can be attributed to users, not abstract entities

**Trade-off**
- Requires explicit user–organization relationships
- Slightly more modeling upfront, but significantly safer and more scalable

