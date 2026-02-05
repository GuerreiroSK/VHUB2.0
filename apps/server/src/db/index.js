import { Pool } from 'pg';

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if( !DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD ) {
    throw new Error ('Missing database configuration. Check DB_* environment variable');
}

const db_pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
});

export default db_pool;
