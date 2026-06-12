import ConflictError from "../errors/ConflictError.js";
import NotFoundError from "../errors/NotFoundError.js";
import { registerToAnEvent as registerToAnEventService } from "../services/event_attendees.service.js";

export async function registerToAnEvent(req, res) {

    const eventId = Number(req.params.id);

    const userId = Number(req.body.userId);

    if (!Number.isInteger(eventId) || eventId <= 0 ) {

        return res.status(400).json({ message: 'id must be a positive integer'});
    }

    if (!Number.isInteger(userId) || userId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer'});
    }

    try {
        
        const registerToEvent = await registerToAnEventService(userId, eventId);

        return res.status(201).json(registerToEvent);

    } catch(err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: err.message});
        }

        if (err instanceof ConflictError) {

            return res.status(409).json({message: err.message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}