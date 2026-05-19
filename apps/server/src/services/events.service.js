import { getEventData, 
    getAllEvents, 
    getEventsByOrganizationId, 
    getEventById as getEventByIdRepo,
    createEvent as createEventRepo,
    updateEvent as updateEventRepo, 
} from '../repositories/events.repository.js';

import { getOrganizationById, getAllOrganizations} from '../repositories/organizations.repository.js';

import NotFoundError from '../errors/NotFoundError.js';

export async function getEventTestMessage() {

    const event = await getEventData();

    return event.toPublic();
}

export async function getEventById(id) {

    const event = await getEventByIdRepo(id);

    return event.toPublic();
}

export async function listEvents(organizationId) {

    if (organizationId == null) {

        const events = await getAllEvents();

        return events.map(e => e.toPublic());
        
    } else {

        await getOrganizationById(organizationId);

        const events = await getEventsByOrganizationId(organizationId);

        return events.map(e => e.toPublic());    
    }
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

export async function listEventsPaginated({page, limit, organizationId}) {

    let offset = (page - 1) * limit;

    if (organizationId === undefined) {

        const events = await getAllEvents(limit, offset);

        return events.map(e => e.toPublic());

    } else {

        await getOrganizationById(organizationId);

        const events = await getEventsByOrganizationId(organizationId, limit, offset);

        return events.map(e => e.toPublic());
    }
}

export async function createEvent(eventName, location, email, organizationId, startDateTime, endDateTime) {

    await getOrganizationById(organizationId);

    const newEvent = await createEventRepo(eventName, location, email, organizationId, startDateTime, endDateTime);

    return newEvent.toPublic();
}

export async function updateEvent(id, fields) {

    const updatedEvent = await updateEventRepo(id, fields);

    return updatedEvent.toPublic();
}