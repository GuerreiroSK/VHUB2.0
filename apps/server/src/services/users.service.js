import {
    getUserData,
    getUserByEmail,
    getAllUsers as getAllUsersRepo,
    getUserById as getUserByIdRepo,
    createUser as createUserRepo,
    updateUser as updateUserRepo,
    deleteUser as deleteUserRepo
} from "../repositories/users.repository.js";

import ConflictError from "../errors/ConflictError.js";

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
    
    const createdUser = await createUserRepo(name, email, password);

    return createdUser.toPublic();
}

export async function updateUser(id, fields) {

    await getUserByIdRepo(id);

    if (fields.email) {

        const checkEmail = await getUserByEmail(fields.email);

        if ( checkEmail !== null && id !== checkEmail.id) {

            throw new ConflictError('This email is already exists.')
        }
    }

    const updatedUser = await updateUserRepo(id, fields);

    return updatedUser.toPublic();
}

export async function deleteUser(id) {

    await deleteUserRepo(id);
}