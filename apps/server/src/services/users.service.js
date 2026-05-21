import ConflictError from "../errors/ConflictError.js";
import {
    getUserData,
    getUserByEmail,
    getAllUsers as getAllUsersRepo,
    getUserById as getUserByIdRepo,
    createUser as createUserRepo
} from "../repositories/users.repository.js";

export async function getUserTestMessage() {

    const user = await getUserData();

    return user.toPublic();
}

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