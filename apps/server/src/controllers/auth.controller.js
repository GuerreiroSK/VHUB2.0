import { login as loginService } from '../services/auth.service.js';

import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

export async function login (req, res) {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({message: 'Email and Password fields cannot be empty.'});
    }

    try {

        const checkLogin = await loginService(email, password);

        return res.status(200).json(checkLogin);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: err.message});
        }

        if (err instanceof UnauthorizedError) {

            return res.status(401).json({message: err.message});
        }

        return res.status(500).json({message: 'Internal server error.'});
    }
}