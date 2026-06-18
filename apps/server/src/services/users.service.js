import bcrypt from 'bcrypt';
import { getUserByEmail,
    getAllUsers as getAllUsersRepo,
    getUserById as getUserByIdRepo,
    createUser as createUserRepo,
    updateUser as updateUserRepo,
    deleteUser as deleteUserRepo
} from "../repositories/users.repository.js";

import ConflictError from "../errors/ConflictError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

export async function getAllUsers() {

    const users = await getAllUsersRepo();

    return users.map( e => e.toPublic());
}

export async function getUserById(id) {

    const user = await getUserByIdRepo(id);

    return user.toPublic();
}

export async function createUser(name, email, password) {

    const checkUserEmmail = await getUserByEmail(email);

    if (checkUserEmmail !== null) {

        throw new ConflictError('This email already exists/registered');

    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const createdUser = await createUserRepo(name, email, hashedPassword);

    return createdUser.toPublic();
}

export async function updateUser(id, fields, requestingUserId) {

    await getUserByIdRepo(id);

    if (id !== requestingUserId) {

        throw new UnauthorizedError('Unauthorized access.');
    }

    if (fields.email) {

        const checkEmail = await getUserByEmail(fields.email);

        if ( checkEmail !== null && id !== checkEmail.id) {

            throw new ConflictError('This email is already exists.')
        }
    }

    const updatedUser = await updateUserRepo(id, fields);

    return updatedUser.toPublic();
}

export async function deleteUser(id, requestingUserId) {

    if (id !== requestingUserId) {

        throw new UnauthorizedError('Unauthorized access.')
    }

    await deleteUserRepo(id);
}