import { getUserTestMessage, 
    getAllUsers as getAllUsersService, 
    getUserById as getUserByIdService, 
    createUser as createUserService,
    updateUser as updateUserService
} from "../services/users.service.js";
import NotFoundError from "../errors/NotFoundError.js";
import ConflictError from "../errors/ConflictError.js";

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

export async function createUser(req, res) {

    const {name, email, password } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({ message: 'Name, Email and Password fields cannot be empty' });
    }

    try {

        const createdUser = await createUserService(name, email, password);

        return res.status(201).json(createdUser);
    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message});

        } 
        
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export async function updateUser(req, res) {

    const userId = Number(req.params.id);

    const { name, email, password } = req.body;

    const fields = {};

    if (name) fields.name = name;
    if (email) fields.email = email;
    if (password) fields.password = password;

    if (!Number.isInteger(userId) || userId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });

    } else if (Object.keys(fields).length === 0) {

        return res.status(400).json({ message: 'No fields were updated' });

    }

    try {

        const updatedUser = await updateUserService(userId, fields);

        return res.status(200).json(updatedUser);

    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message });

        } 
        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: 'User not found' });
            
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}