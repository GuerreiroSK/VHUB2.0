import jwt from 'jsonwebtoken';

export async function verifyToken(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {

        return res.status(401).json({ message: 'No token provided.' });
    }

    try {

        const token = header.split(' ')[1];

        const verification = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = verification.id;

        req.userRole = verification.role;

        next();

    } catch (err) {

        return res.status(401).json({ message: 'Invalid token.' });
    }
}