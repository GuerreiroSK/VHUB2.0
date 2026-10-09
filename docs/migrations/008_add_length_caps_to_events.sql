-- 008: add length caps to events.name (60) and events.location (35)
-- Caps protect frontend layouts while leaving room for realistic values (longest real town tested: 26 chars)

BEGIN;
    ALTER TABLE events ALTER COLUMN name TYPE varchar(60);
    ALTER TABLE events ALTER COLUMN location TYPE varchar(35);
COMMIT;