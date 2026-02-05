import { getUserTestData } from "../repositories/users.repositorie.js";

export function getUserTestMessage() {
    const user = getUserTestData();
    return user.toPublic();
}