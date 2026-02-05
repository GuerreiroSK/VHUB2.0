import db_pool from '../db/index.js';
import User from '../entities/User.js'


export async function getUserData() {
    
    const result = await db_pool.query(
        'SELECT id, name, email, password FROM users LIMIT 1'
    );

    const row = result.rows[0]; 

    if (!row){
        throw new Error('No users found.');
    }

    const user = new User(
        row.id,
        row.name,
        row.email,
        row.password
    );

    return user;
}
