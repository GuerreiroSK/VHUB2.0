import { getEventTestMessage,
     getEventsWithOrganizations, 
     getEventById as getEventByIdService,
     createEvent as createEventService,
     listEventsPaginated
    } from '../services/events.service.js';

import NotFoundError from '../errors/NotFoundError.js';
export async function eventTest (req, res) {

    const event = await getEventTestMessage();

    return res.json(event);
}

export async function getEventById (req, res) {

    const { id } = req.params;

    const eventId = Number(id);

    if (Number.isNaN(eventId) || !Number.isInteger(eventId) || eventId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });
    }

    try {

        const event = await getEventByIdService(eventId);

        return res.json(event);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

export async function eventsWithOrganizations (req, res) {

    const eventsWithOrgs = await getEventsWithOrganizations();

    return res.json(eventsWithOrgs);
}

export async function getEvents(req, res) {

    const { page, limit, organizationId } = req.query;

    const pageNum = page === undefined ? 1 : Number(page);

    const limitNum = limit === undefined ? 20 : Number(limit);

    const pageInvalid = Number.isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum <= 0;

    const limitInvalid = Number.isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum <= 0 || limitNum > 100;

    if (pageInvalid || limitInvalid ) {

        return res.status(400).json({ message: 'page and limit must be positive integers (limit max 100)'});
    } 

    try {

        if (organizationId === undefined) {

            const events = await listEventsPaginated({ page: pageNum, limit: limitNum });

            return res.json(events);

        } else {

            const id = Number(organizationId);

            if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {

                return res.status(400).json({ message: 'organizationId must be a positive integer' });
            }

            const events = await listEventsPaginated({ page: pageNum, limit: limitNum, organizationId: id });

            return res.json(events);
        }

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });

        }
    }
}

export async function createEvent(req, res) {

    const { eventName, location, email, organizationId } = req.body;

    if (!eventName || !location || !email || !organizationId) {

        return res.status(400).json({ message: 'Name, Email, Location and Organization ID fields cannot be empty' });
    }

    try {

        const createdEvent = await createEventService(eventName, location, email, organizationId);

        return res.status(201).json(createdEvent);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}