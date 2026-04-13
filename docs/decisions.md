## Project Decisions & Rationale

This document records **key technical and architectural decisions**
made during the development of the VHUB project.

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

---

## Collection Handling in Repositories

**Decision**
Collection methods (e.g. `getAll*`) return arrays, even when empty.

**Why**
- Absence of data is not an error
- Provides consistent API behavior
- Avoids unnecessary error handling in higher layers

**Related Decision**
- Singular methods (getById, getData) throw when no data is found.

---

## Row-to-Entity Mapping

**Decision**
Repositories map database rows into domain entities using array transformations.

**Why**
- Prevents raw data leakage
- Keeps domain model consistent
- Centralizes data transformation logic

---

## Service Layer Composition

**Decision**
Allow the service layer to compose data from multiple repositories to fulfill complex use cases.

**Why**
- Keeps repositories focused on data access
- Prevents coupling between entities at the repository level
- Enables flexible and reusable business logic
- Supports richer API responses without breaking architecture

**Result**
- New endpoint `/api/events/with-organizations` implemented via service composition
- Clean separation between data fetching and response shaping

---

## Filtering via Query Params with Strict Existence Semantics

**Decision**
Support event filtering by organization using a query param:

`GET /api/events?organizationId=<id>`

and enforce strict existence semantics:

- invalid `organizationId` → 400
- organization does not exist → 404
- organization exists but has no events → 200 + []

**Why**
- Query params are the standard way to express optional filters without multiplying endpoints
- Strict semantics eliminate ambiguity:
  - an empty events list should not silently hide a missing organization
- Keeps responsibilities clean:
  - Controller validates format (string → number, positive integer)
  - Service enforces meaning (organization must exist when filtering)
  - Repository filters in SQL (WHERE organization_id = $1)

**Trade-off**
- Requires an extra DB lookup (org existence check) when filtering
- Error mapping initially relied on message checks; now standardized with `NotFoundError`

---

## Filtering with Route Parameters

**Decision**  
Support organization-specific event retrieval using a route parameter:

`GET /api/organizations/:id/events`

**Why**
- Route parameters are appropriate when identifying a specific parent resource and accessing a related collection beneath it
- This makes the URL expressive and easy to understand
- It reflects the relationship that the events belong to a specific organization

**Trade-off**
- The endpoint becomes coupled to the current resource hierarchy
- If the relationship or API structure changes later, the URL design may also need to change

**Result**
- Events can be retrieved directly for a specific organization through a clear and predictable endpoint
- The API is easier to read than a more generic endpoint with filtering logic

---

## Typed Not-Found Errors

**Decision**
Introduce a custom `NotFoundError` class and use `instanceof` checks in controllers.

**Why**
- Avoids brittle error handling based on string comparisons
- Makes controller error mapping more reliable and consistent
- Improves maintainability as the codebase grows

**Result**
- Repositories/services can throw typed not-found errors
- Controllers translate `NotFoundError` to HTTP 404
- Unknown errors continue to map to HTTP 500

---

**Additional Note**
- Validation is applied at the controller level for request format
- Repositories focus on data access and row-to-entity mapping
- Services enforce domain meaning and composition