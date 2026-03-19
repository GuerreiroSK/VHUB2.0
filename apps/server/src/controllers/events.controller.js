import NotFoundError from '../errors/NotFoundError.js';
import { getEventTestMessage, listEvents, getEventsWithOrganizations, getEventById as getEventByIdService } from '../services/events.service.js'

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

    const { organizationId } = req.query;

    try {
        if (organizationId === undefined) {

            const events = await listEvents();

            return res.json(events);

        } else {

            const id = Number(organizationId);

            if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {

                return res.status(400).json({ message: 'organizationId must be a positive integer' });
            }

            const events = await listEvents(id);

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