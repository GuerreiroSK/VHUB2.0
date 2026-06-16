## Truthy Checks for Field Validation in Update Operations

**Decision**
Use truthy checks (`if (name)`) instead of `!== undefined` when building the fields object in update controllers.

**Why**
- `!== undefined` only rejects missing fields — it allows empty strings through
- An empty string would overwrite existing data with a blank value, which is never the intended behavior
- Truthy checks reject both `undefined` and `""` in a single condition
- Consistent with how required field validation already works (`if (!name)`)

**Trade-off**
- Truthy checks also reject `0` and `false` — not relevant for string fields but worth being aware of for future numeric fields

**Result**
- All update controllers now use truthy checks for optional field population
- Empty strings are silently ignored — only meaningful values update the record

---

## Existence Check Before Conflict Check in Update Operations

**Decision**
In update service functions, always verify the resource exists (via repository) before checking for conflicts (e.g. email uniqueness).

**Why**
- Without the existence check first, a request for a non-existent resource with a conflicting email returns 409 instead of 404
- The correct semantic is: if the resource doesn't exist, it's a 404 — conflict checks are irrelevant
- Error priority matters: existence errors should surface before business rule violations

**Trade-off**
- Adds an extra DB call before the update (one SELECT, then one UPDATE)
- Small performance cost, but necessary for correct and meaningful error responses

**Result**
- `updateUser` and `updateOrganization` now call the repository existence check first
- Non-existent resources always return 404 regardless of the request body
- Consistent with how the rest of the codebase handles error priority

---

## Email Uniqueness Check Must Include Soft Deleted Records

**Decision**
Remove `AND deleted_at IS NULL` from `getOrganizationByEmail` — email uniqueness checks query all records regardless of soft delete status.

**Why**
- The database unique constraint on `email` applies to all rows, deleted or not
- If the application layer doesn't catch the conflict first, PostgreSQL throws a raw constraint violation error
- That error is not a `ConflictError` — it falls through to 500 instead of 409
- A soft deleted org's email should be considered taken until explicitly released (future moderation flow)

**Trade-off**
- Soft deleted organizations "hold" their email permanently until hard deleted or a moderation/recovery flow is implemented
- This is intentional — prevents email reuse without admin review

**Result**
- `getOrganizationByEmail` now queries without `deleted_at` filter
- Service correctly throws `ConflictError` before the update reaches the DB
- 409 is returned instead of 500 for duplicate email attempts against soft deleted records

---

## Seed Script Calls Service Layer, Not RepositoryDecision

**Decision**
- The seed script imports and calls service functions (createUser, createOrganization, etc.) directly — never repository functions.

**Why**
- Repository functions have no business logic — they just run SQL and return entities
- Service functions contain the checks that protect data integrity: email uniqueness, organization existence before event creation, etc.
- Bypassing the service layer would skip these checks and risk inserting invalid or conflicting data
- The seed script should produce data that would pass the same rules as a real API request

**Trade-off**
- Slightly more DB calls per insert (existence/uniqueness checks run on every create)
- Negligible for a dev tool with a small dataset

**Result**
- seed.js imports from services/ only
- Repository functions are never called directly from the script

---

## TRUNCATE + RESTART IDENTITY Instead of DELETE for Database Reset

**Decision**
- The seed script clears all tables using a single TRUNCATE TABLE event_attendees, events, organizations, users RESTART IDENTITY CASCADE statement instead of DELETE FROM.

**Why**
- DELETE removes rows but leaves the auto-increment sequence at its last value — the next insert gets id = 6 (or whatever it was at), not id = 1
- RESTART IDENTITY resets all sequences back to 1, so every run of the script produces the same predictable IDs
- Predictable IDs are the whole point of the script — Postman collections that use /api/users/1 stay valid after every reseed
- Listing all four tables in one TRUNCATE statement lets Postgres resolve FK dependencies atomically — no need to worry about truncation order

**Trade-off**
- TRUNCATE is more destructive than DELETE — no WHERE clause, no partial clears
- CASCADE could silently wipe tables added later if they have FK references to our tables — acceptable for a dev tool, never for production

**Result**
- One TRUNCATE statement covers all four tables in one atomic operation
- Sequences reset to 1 on every run
- Postman collections remain valid after every reseed

---

## ESM Module Hoisting Prevents dotenv From Running Inside seed.js

**Decision**
- The seed script does not call dotenv.config() internally. Environment variables are loaded via Node's --env-file flag at runtime, exposed as "seed": "node --env-file=.env src/scripts/seed.js" in package.json.

**Why**
- In ESM (import/export), all import statements are hoisted and resolved before any code executes
- Even if dotenv.config() is written at the top of seed.js, all imports (including db/index.js) run before dotenv has a chance to populate process.env
- db/index.js throws immediately if any DB_* variable is missing — so the script crashes before a single line of seed logic runs
- --env-file is handled by Node itself before the module system starts, so environment variables are available from the very first import

**Trade-off**
- The script must always be run with --env-file — node src/scripts/seed.js alone will fail
- Mitigated by the npm run seed script in package.json which handles the flag automatically

**Result**
- seed.js has no dotenv import — cleaner file, no false sense of security
- package.json "seed" script handles the flag: node --env-file=.env src/scripts/seed.js
- Run via npm run seed from inside apps/server/