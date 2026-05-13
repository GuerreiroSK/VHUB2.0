import { getUserTestMessage, getAllUsers as getAllUsersService, getUserById as getUserByIdService } from "../services/users.service.js";
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

export async function getAllUsers(req, res) {

    try {
        const users = await getAllUsersService();

        return res.json(users);

    } catch (err) {

            return res.status(500).json({ message: 'Internal server error.'}); 
    }
}

export async function getUserById (req, res) {

    const { id } = req.params;

    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });
    }

    try {

        const user = await getUserByIdService(userId);

        return res.json(user);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}