import { getEventTestMessage, listEvents } from '../services/events.service.js'
import { getEventsWithOrganizations } from '../services/events.service.js';

export async function eventTest (req, res) {

    const event = await getEventTestMessage();

    res.json(event);
}

export async function eventsWithOrganizations (req, res) {

    const eventsWithOrgs = await getEventsWithOrganizations();

    res.json(eventsWithOrgs);
}

export async function getEvents(req, res) {

    const { organizationId } = req.query;

    try {
        if (!organizationId) {

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

        if (err.message === "Organization not found.") {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });

        }
    }
}