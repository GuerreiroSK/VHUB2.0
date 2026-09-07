-- 007: add description column to events
-- NOT NULL DEFAULT '' so existing rows survive the ALTER (production-safe pattern)

ALTER TABLE events ADD COLUMN description varchar NOT NULL DEFAULT '';