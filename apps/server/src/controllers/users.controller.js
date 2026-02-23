import { getUserTestMessage } from "../services/users.service.js";
import NotFoundError from "../errors/NotFoundError.js";

export async function userTest(req, res) {

    try {
        const user = await getUserTestMessage();
    
        return res.json(user);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });
        }   
    }
}