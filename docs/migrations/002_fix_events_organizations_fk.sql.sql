-- Fix incorrect foreign key constraint
ALTER TABLE events DROP CONSTRAINT events_organizations_fk;

ALTER TABLE events ADD CONSTRAINT events_organizations_fk 
FOREIGN KEY (organization_id) REFERENCES organizations(id) 
ON UPDATE CASCADE ON DELETE RESTRICT;