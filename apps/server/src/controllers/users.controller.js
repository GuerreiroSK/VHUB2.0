import { getUserTestMessage } from "../services/users.service.js";

export async function userTest(req, res) {

    const user = await getUserTestMessage();
    
    res.json(user);
}