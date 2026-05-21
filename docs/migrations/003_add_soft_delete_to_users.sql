-- Add soft delete to users
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;