# Database Schema (PostgreSQL)

This document describes the current PostgreSQL schema used by VHUB / Voluntr.

Scope:
- tables, columns, constraints, and relationships
- design decisions relevant to the schema

Out of scope:
- PostgreSQL installation / DBeaver usage (see `docs/postgresql-setup.md`)
- application architecture (see `docs/architecture.md`)
- authentication details (see `docs/auth.md`)

---

## Conventions

- Table names are **plural** (e.g. `users`, `events`)
- Column names are **snake_case**
- Primary keys use `id` (auto-generated)
- Emails are stored as strings; application code is responsible for normalizing them (lowercasing) before insert/update
- Schema changes follow “**use cases, not imagination**”:
  - we avoid speculative fields like `deleted_at` until needed

---

## Tables

### `users`

Represents individual users of the platform.

Columns:
- `id` (PK)
- `name` (NOT NULL)
- `email` (NOT NULL, UNIQUE)
- `password` (NOT NULL)  
  - stored as a string; hashing is handled by the application layer (later, during auth)
- `created_at` (NOT NULL, default `now()`)

Constraints:
- Primary key: `users.id`
- Unique: `users.email`

---

### `organizations`

Represents organizations that can organize events.

Columns:
- `id` (PK)
- `name` (NOT NULL)
- `email` (NOT NULL, UNIQUE)
- `password` (NOT NULL)
- `description` (NULLABLE)
- `location` (NULLABLE)
- `created_at` (NOT NULL, default `now()`)

Constraints:
- Primary key: `organizations.id`
- Unique: `organizations.email`

---

### `events`

Represents volunteering events created by organizations.

Columns:
- `id` (PK)
- `name` (NOT NULL)
- `location` (NOT NULL)
- `contact_email` (NOT NULL)
- `organization_id` (NOT NULL, FK)
- `created_at` (NOT NULL, default `now()`)

Constraints:
- Primary key: `events.id`
- Foreign key: `events.organization_id → organizations.id`
  - On delete: `RESTRICT` (prevents deleting an organization that still has events)
  - On update: `CASCADE`

---

## Relationships

### Organizations → Events (1:N)

- One organization can have many events
- Each event belongs to exactly one organization

Enforced by:
- `events.organization_id` foreign key referencing `organizations.id`

---

## Notes on Future Schema Growth

The following concepts are intentionally not implemented yet and will be introduced only when supported by a use case:

- Soft deletes (`deleted_at`)
- Attendance / interest (likely a join table, e.g. `event_attendees`)
- Roles / permissions (admins, org members, etc.)
- Status fields (published/canceled/etc.)
- Capacity and scheduling details beyond the current Event model

When these are introduced, this document will be updated as part of the same PR that changes the schema.
