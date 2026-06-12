import ConflictError from "../errors/ConflictError.js";
import NotFoundError from "../errors/NotFoundError.js";

import { registerToAnEvent as registerToAnEventService,
    getAttendeesByEventId as getAttendeesByEventIdService,
    getEventsByUserId as getEventsByUserIdService,
    cancelRegistration as cancelRegistrationService
} from "../services/event_attendees.service.js";

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

export async function getAttendeesByEventId(req, res) {

    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer'});
    }

    try {

        const attendees = await getAttendeesByEventIdService(eventId);

        return res.status(200).json(attendees);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: err.message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}

export async function getEventsByUserId(req, res) {

    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {

        return res.status(400).json({message: 'id must be a positive integer'});
    }

    try {

        const eventsByUser = await getEventsByUserIdService(userId);

        return res.status(200).json(eventsByUser);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: err.message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}

export async function cancelRegistration(req, res) {

    const userId = Number(req.params.userId);

    const eventId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {

        return res.status(400).json({message: 'id must be a positive integer'});
    }

    if (!Number.isInteger(eventId) || eventId <= 0) {

        return res.status(400).json({message: 'id must be a positive integer'});
    }

    try {

        await cancelRegistrationService(userId, eventId);

        return res.status(204).send();

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: err.message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}