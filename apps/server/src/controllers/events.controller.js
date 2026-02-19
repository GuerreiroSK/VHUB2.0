import { getEventTestMessage } from '../services/events.service.js'
import { getEventsWithOrganizations } from '../services/events.service.js';

export async function eventTest (req, res) {

    const event = await getEventTestMessage();

    res.json(event);
}

export async function eventsWithOrganizations (req, res) {

    const eventsWithOrgs = await getEventsWithOrganizations();

    res.json(eventsWithOrgs);
}