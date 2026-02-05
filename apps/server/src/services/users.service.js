import { getUserData } from "../repositories/users.repository.js";

export async function getUserTestMessage() {

    const user = await getUserData();

    return user.toPublic();
}