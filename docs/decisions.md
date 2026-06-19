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

---

## Password Hashing with bcrypt on User Creation

**Decision**
Passwords are hashed with bcrypt before being stored in the database. Plain text passwords are never persisted.

**Why**
- Storing plain text passwords means anyone with database access can read every user's password
- Most users reuse passwords across multiple services — a leaked password here could compromise their email, bank, and other accounts
- Hashing is one-way — even if the database is compromised, the original password cannot be recovered
- bcrypt adds a random salt to every hash, so two identical passwords produce different hashes — protecting against rainbow table attacks
- Salt rounds (set to 10) make each hash computationally expensive, slowing down brute-force attempts

**Trade-off**
- `createUser` now has an extra async operation (the hash) before every insert
- Negligible performance cost at low scale; intentional slowness is the point

**Result**
- `users.service.js` calls `bcrypt.hash(password, 10)` before passing to the repository
- The repository receives and stores only the hashed value
- Plain text passwords never touch the database

---

## UnauthorizedError as a New Typed Error

**Decision**
A new `UnauthorizedError` class was created to represent authentication failures, mapping to HTTP 401.

**Why**
- `NotFoundError` (404) and `ConflictError` (409) don't cover authentication failures
- A dedicated typed error allows controllers to map it precisely to 401 Unauthorized
- More reusable than a `WrongPasswordError` — will cover future cases like expired JWT tokens, missing tokens, or insufficient permissions
- Consistent with the existing pattern: one typed error per HTTP error category

**Trade-off**
- Another error file to maintain
- Worth it for consistency and future reuse

**Result**
- `UnauthorizedError.js` added to `src/errors/`
- `auth.service.js` throws `UnauthorizedError` when `bcrypt.compare()` returns `false`
- `auth.controller.js` catches it and returns 401

---

## Auth as a Separate Layer, Not Inside Users

**Decision**
Login logic lives in dedicated `auth.service.js`, `auth.controller.js`, and `auth.route.js` files — not inside the existing users layer.

**Why**
- Login is an authentication concern, not a user management concern
- Mixing auth logic into `users.service.js` would make it responsible for two different things — violating single responsibility
- A separate auth layer can grow independently: logout, JWT refresh, OAuth, roles — none of which belong in user CRUD
- `POST /api/auth/login` is semantically cleaner than `POST /api/users/login`

**Trade-off**
- `auth.service.js` imports from `users.repository.js` — a cross-domain import, but acceptable since auth needs user data to verify credentials

**Result**
- `src/routes/auth.route.js` — mounts at `/api/auth`
- `src/controllers/auth.controller.js` — handles req/res for auth endpoints
- `src/services/auth.service.js` — contains login logic
- `app.js` mounts `authRouter` at `/api/auth`

---

## Role Stored in JWT Payload, Not Fetched from DB

**Decision**
The user's role is included in the JWT payload (`{ id, role }`) at login and read from the token on every request via `req.userRole`. No DB call is made to fetch the role on each request.

**Why**
- JWT verification is stateless — no DB call needed to know who the user is or what role they have
- Fetching role from DB on every request adds latency and couples auth to the database unnecessarily
- The token is signed — the role cannot be tampered with without invalidating the signature

**Trade-off**
- If a user's role changes, their existing token still carries the old role until it expires (24h)
- Acceptable for now — role changes will be rare and admin-controlled

**Result**
- `auth.service.js` includes `role: user.role` in `jwt.sign()` payload
- `auth.middleware.js` attaches `req.userRole = verification.role` on every verified request

---

## Raw SQL for Role Assignment in Seed Script

**Decision**
Role assignment for admin and developer users in `seed.js` is done via raw `db_pool.query()` after user creation, not through the service layer.

**Why**
- `createUser` service intentionally does not accept a `role` parameter — users cannot set their own role
- The seed script is a dev tool, not a real API request — bypassing the service for role assignment is acceptable here
- Users are still created via the service (password hashing, email uniqueness checks all run normally)
- Role update is a separate explicit step, making the intent clear

**Trade-off**
- Direct DB call in the seed — acceptable for a dev tool, never for production code

**Result**
- `seed.js` calls `createUser` for all users, then raw SQL to set `'admin'` and `'developer'` roles on specific users by email

---

## requireRole as a Middleware Factory

**Decision**
Role checking is handled by a reusable middleware factory `requireRole(roles)` in `src/middleware/role.middleware.js`, not inside individual service functions.

**Why**
- Role checking is not business logic — it is an access control concern that belongs before the controller runs
- A middleware factory keeps the check reusable — one function works for any combination of roles across any route
- Adding `requireRole(['admin', 'developer'])` to a route is explicit and readable — you can see which routes are protected just by reading the router file
- Avoids duplicating role checks across multiple service functions

**Trade-off**
- Role check happens before the controller — if the resource doesn't exist, the user gets 401 before 404. Acceptable for now.

**Result**
- `role.middleware.js` exports `requireRole(roles)` — accepts an array of allowed roles, returns a middleware function
- Uses `Array.includes()` to check `req.userRole` against the allowed list
- Must always run after `verifyToken` — `req.userRole` doesn't exist until the token is verified
- Applied to all write operations on organizations and events

---

## Admin and Developer Bypass on User Ownership Checks

**Decision**
The ownership checks in `updateUser` and `deleteUser` services are bypassed when the requesting user has the `admin` or `developer` role.

**Why**
- Admins and developers need to be able to manage any user account — blocking them with ownership checks would make administration impossible
- The bypass is implemented in the service layer (business logic), not the middleware — it is a domain decision, not an access control decision
- `req.userRole` is passed from the controller to the service alongside `req.userId`

**Trade-off**
- Service functions now have slightly more complex signatures — acceptable given the clear separation of concerns

**Result**
- `deleteUser(id, requestingUserId, requestingUserRole)` and `updateUser(id, fields, requestingUserId, requestingUserRole)` check: if `id !== requestingUserId` AND role is not admin or developer → throw `UnauthorizedError`
- Admins and developers can update or delete any user account