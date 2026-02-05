import { getUserData } from "../repositories/users.repositorie.js";

export function getUserTestMessage() {

    const user = getUserData();

    return user.toPublic();
}