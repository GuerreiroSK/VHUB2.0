-- Add soft delete to organizations
ALTER TABLE organizations ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;

-- Add soft delete to events
ALTER TABLE events ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;

-- Add event scheduling columns
ALTER TABLE events ADD COLUMN start_datetime TIMESTAMP DEFAULT NULL;
ALTER TABLE events ADD COLUMN end_datetime TIMESTAMP DEFAULT NULL;