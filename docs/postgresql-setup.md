## PostgreSQL & DBeaver Setup Guide

This document describes how PostgreSQL was set up locally for the VHUB / Voluntr project,
including common issues encountered and the reasoning behind each decision.

The goal is to provide a reproducible setup and future reference.

---

## Why PostgreSQL

PostgreSQL was chosen because:
- it is a production-grade relational database
- it supports strong constraints and relationships
- it enforces data integrity (foreign keys, uniqueness)
- it is widely used in real backend systems

The database is treated as an **independent system**, not just a data store.

---

## PostgreSQL Installation & Clusters

After installation, PostgreSQL may not appear to be “running”.
This is because PostgreSQL uses **clusters**, not a single global service.

### Verify existing clusters

```bash
pg_lsclusters
```
- If no running cluster exists, PostgreSQL will not accept connections.

### Create and start a cluster (if needed)

```bash
sudo pg_createcluster 16 main --start
```
- Verify again:

```bash
pg_lsclusters
```
- A running cluster is required before any database or user can be created.

### Access PostgreSQL as superuser

```bash
sudo -u postgres psql
```
### Create database

```sql
CREATE DATABASE vhub;
```

### Create application user

```sql
CREATE USER 'your_user_here' WITH PASSWORD 'your_password_here';
```

### Grant database access

```sql
GRANT ALL PRIVILEGES ON DATABASE vhub TO 'your_user_here';
```

## Grant schema persmissions (critical step)
- After connecting to the database:

```bash 
sudo -u postgres psql vhub
```
- Run:

```sql 
GRANT ALL ON SCHEMA public TO 'your_user_here';
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO 'your_user_here';
```
- Without this step, table creation and modifications will fail with `permission denied for schema public`.

## DBeaver Usage
- DBeaver is used as a visual database client, not as a replacement for SQL knowledge.

### Why DBeaver
- Easier inspection of tables and data
- SQL preview before execution
- Visual ER diagrams
- Sager schema changes

### Connecting to PostgreSQL
- Create a new PostgreSQL connection
- Use: 
 - database: vhub
 - user: 'your_user_here'
 - password: configured password
- Test connection before saving

### SQL Preview & Execution
- When creating or editing tables, DBeaver shows a SQL Preview.

#### Important rule:

- Changes do not exist unit the SQL preview is executed.

Closing the preview without executing means nothing was saved.

### Schema Creation

Tables were created manually using SQL/DBeaver UI:
- users
- organizations
- events

Desing principles:
- plural table names
- explicit primary keys
- foreign keys enforced at the database level
- no premature soft deletes ( deleted_at )

### Foreign Keys & ER Diagrams
Foreign keys must:
1. reference an existing column
2. be saved and executed explicitly

If relationships do not appear in the ER diagram:
- verify the FK exists in the table
- regenerate the diagram

The Foreign Keys tab is the source of truth, not the diagram.

### Password Storage

The database stores the passwords as plain strings.

Important clarifications:

- the database does not know what a "password" is
- hashing is an application responsability
- hashing will be implemented at the service/auth layer

## Backend Integration Summary
- PostgreSQL is accessed via a shared connection pool
- The pool is created in src/db/index.js
- Configuration is read from environment variables
- The application fails fast if configuration is missing
- Only repositories interact with the database

This ensures:

- clean separation of concerns
- safe handling of credentials
- replaceable data sources

### Key Takeaways
- PostgreSQL setup involves clusters, roles and permissions
- Tools like DBeaver assist but do not replace understanding SQL
- Database constraints are part of application correctness
- Clear separation between infrastructure and domain logic is essential