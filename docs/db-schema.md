# Database Schema (PostgreSQL)

This document describes the current PostgreSQL schema used by VHUB.

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
- Schema changes are tracked in `docs/migrations/` and applied manually via DBeaver

---

## Tables

### `users`

Represents individual users of the platform.

Columns:
- `id` (PK)
- `name` (NOT NULL)
- `email` (NOT NULL, UNIQUE)
- `password` (NOT NULL)
  - stored as a string; hashing handled by application layer during auth
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
- `description` (NULLABLE)
- `location` (NULLABLE)
- `created_at` (NOT NULL, default `now()`)
- `deleted_at` (NULLABLE) — soft delete timestamp; NULL means active

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
- `email` (NOT NULL)
- `organization_id` (NOT NULL, FK)
- `start_datetime` (NULLABLE) — event start date and time
- `end_datetime` (NULLABLE) — event end date and time
- `created_at` (NOT NULL, default `now()`)
- `deleted_at` (NULLABLE) — soft delete timestamp; NULL means active

Constraints:
- Primary key: `events.id`
- Foreign key: `events.organization_id → organizations.id`
  - On delete: `RESTRICT`
  - On update: `CASCADE`

---

## Relationships

### Organizations → Events (1:N)

- One organization can have many events
- Each event belongs to exactly one organization

Enforced by:
- `events.organization_id` foreign key referencing `organizations.id`

---

## Schema Change History

| Change | Table | Description |
|--------|-------|-------------|
| Added `deleted_at` | `organizations` | Soft delete support |
| Added `deleted_at` | `events` | Soft delete support |
| Added `start_datetime` | `events` | Event scheduling |
| Added `end_datetime` | `events` | Event scheduling |
| Fixed FK constraint | `events` | `events_organizations_fk` was referencing `events.id` instead of `events.organization_id` |

---

## Notes on Future Schema Growth

The following concepts are intentionally not implemented yet:

- Attendance / interest (likely a join table, e.g. `event_attendees`)
- Roles / permissions (admins, org members, etc.)
- Status fields (published/canceled/etc.)
- Capacity limits