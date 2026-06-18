import db_pool from '../db/index.js';
import User from '../entities/User.js';
import NotFoundError from '../errors/NotFoundError.js';

export async function getAllUsers() {

    const result = await db_pool.query(
        'SELECT id, name, email, password, role FROM users WHERE deleted_at IS NULL'
    );

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allUsers = rows.map(row => {

        return new User (
            row.id,
            row.name,
            row.email,
            row.password,
            row.role
        );
    });

    return allUsers;
}

export async function getUserById(id) {

    const result = await db_pool.query(
        'SELECT id, name, email, password, role FROM users WHERE id = $1 AND deleted_at IS NULL',
        [id]
    )

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError('User not found.')
    }

    const user = new User(
        row.id,
        row.name,
        row.email,
        row.password,
        row.role
    );

    return user;
}

export async function getUserByEmail(email) {
    
    const result = await db_pool.query(
        'SELECT id, email FROM users WHERE email = $1', 
        [email]
    );

    const row = result.rows[0];

    if (!row) {

        return null
    }
    
    return row;
}

export async function createUser(name, email, password) {

    const result = await db_pool.query(
        'INSERT INTO users (name, email, password) VALUES ( $1, $2, $3 ) RETURNING id, name, email, password, role', 
    [name, email, password]);

    const row = result.rows[0];

    const newUser = new User(
        row.id,
        row.name,
        row.email,
        row.password,
        row.role
    );

    return newUser;
}

export async function updateUser(id, fields) {

    const setClauses = [];
    const values = [];

    Object.entries(fields).forEach(([key, value]) => {

        setClauses.push(`${key} = $${setClauses.length + 1}`);
        values.push(value);

    });

    values.push(id);

    const result = await db_pool.query(
        `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id, name, email, password`,
        values
    );

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError ('User not found.');
    }

    return new User(
        row.id,
        row.name,
        row.email,
        row.password
    );
}

export async function deleteUser(id) {

    const result = await db_pool.query(
        'UPDATE users SET deleted_at = NOW() WHERE id =$1 AND deleted_at IS NULL',
        [id]
    );

    const row = result.rowCount;

    if (row === 0) {

        throw new NotFoundError('User not found');
    }
}