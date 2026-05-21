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