## Setup-Guide
This guide describes how to set up and run the VHUB backend locally.

---

## Prerequisites

- Node.js ( v18 + recommended )
- Postgre ( v14+ )
- npm
- (Optional) DBeaver for database management

---

## Backend Setup

### 1 - Install backend dependencies

```bash
cd apps/server
npm install

``` 
This installs:
- Express
- PostgreSQL client ( pg )
- dotenv
- development tools ( nodemon )

### 2 - Environment variables
Create a .env file in:

```bash
apps/server/.env

```
With the following variables: 

DB_HOST=localhost
DB_PORT=5432
DB_NAME=vhub
DB_USER=your_user_name
DB_PASSWORD=your_password_here
PORT=3000

### 3 - PostgreSQL setup

- Ensure PostgreSQL is running
- Create:
 - a database named `vhub`
 - a dedicated DB user
- Grant the user permissions on the `public` schema

Detailed PostgreSQL and DBeaver setip is documented in:

```
docs/postgresql-setup.md
```

### 4 - Run the Backend

The backend is started via `src/server.js`. 
while `src/app.js` is responsible only for Express configuration.

```bash
cd apps/server
npm run dev
```
If setup is correct, you should see:

```
Server running on http://localhost:3000
```
### 5 - Verify the API

Test a sample endpoint:

```
GET http://localhost:3000/api/users/test
```
A sucessful response confirms:
- database connectivity
- repository -> service -> controller flow
- environment configuration
