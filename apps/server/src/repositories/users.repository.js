import db_pool from '../db/index.js';
import User from '../entities/User.js';
import NotFoundError from '../errors/NotFoundError.js';


export async function getUserData() {
    
    const result = await db_pool.query(
        'SELECT id, name, email, password FROM users LIMIT 1'
    );

    const row = result.rows[0]; 

    if (!row){
        throw new NotFoundError('No users found.');
    }

    const user = new User(
        row.id,
        row.name,
        row.email,
        row.password
    );

    return user;
}

export async function getAllUsers() {

    const result = await db_pool.query(
        'SELECT id, name, email, password FROM users'
    );

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allUsers = rows.map(row => {

        if (!row.id || !row.name) {
            throw new Error (`Invalid user data for row with id: ${row.id}`);
        }

        return new User (
            row.id,
            row.name,
            row.email,
            row.password
        );
    });

    return allUsers;
}
