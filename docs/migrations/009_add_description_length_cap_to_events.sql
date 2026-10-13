-- 009: add length cap to events.description (3000)
-- Caps the payload size on create/update; longer details can be requested by email (events already have an email field)

ALTER TABLE events ALTER COLUMN description TYPE varchar(3000);