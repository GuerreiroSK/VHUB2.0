import { getEventData } from '../repositories/events.repository.js'
import { getAllEvents } from '../repositories/events.repository.js';
import { getAllOrganizations } from '../repositories/organizations.repository.js';


export async function getEventTestMessage() {

    const event = await getEventData();

    return event.toPublic();
}

export async function getEventsWithOrganizations() {

    const events = await getAllEvents();
    const organizations = await getAllOrganizations();

    if (events.length === 0) {
        return [];
    }

    const organizationMap = {};

    for (const org of organizations) {
        organizationMap[org.id] = org;
    }

    return events.map(event => {

        const organization = organizationMap[event.organizationId];

        if (!organization) {
            throw new Error(`Organization not found for event ${event.id}`);
        }

        const eventPublic = event.toPublic();
        const orgPublic = organization.toPublic();

        const { organizationId, ...eventData } = eventPublic;

        return {
            ...eventData,
            organization: orgPublic
        }
    });
}