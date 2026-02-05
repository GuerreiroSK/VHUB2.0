import { getUserTestData } from "../repositories/users.repositorie.js";

export function getUserTestMessage() {
<<<<<<< HEAD
    const user = getUserTestData();
    return user.toPublic();
=======
    return getUserTestData();
>>>>>>> feature/organizations-layer
}