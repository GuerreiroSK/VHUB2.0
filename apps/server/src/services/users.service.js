import { getUserData, getAllUsers as getAllUsersRepo } from "../repositories/users.repository.js";

export async function getUserTestMessage() {

    const user = await getUserData();

    return user.toPublic();
}

export async function getAllUsers() {

    const users = await getAllUsersRepo();

    return users.map( e => e.toPublic());
}