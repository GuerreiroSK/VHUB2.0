import bcrypt from 'bcrypt';

import { getUserByEmail, getUserById } from '../repositories/users.repository.js';

import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

export async function login(email, password) {

    const userRow = await getUserByEmail(email);

    if (!userRow) {

        throw new NotFoundError('User not found.');
    }    

    const user = await getUserById(userRow.id);

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {

        throw new UnauthorizedError('Unauthorized access.');
    }
    
    return user.toPublic();
}

