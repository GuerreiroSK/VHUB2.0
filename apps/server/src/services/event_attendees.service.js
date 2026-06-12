import ConflictError from "../errors/ConflictError.js";
import { registerToEvent as registerToEventRepo,
    checkIfRegistered as checkIfRegisteredRepo,
    getAttendeesByEventId as getAttendeesByEventIdRepo,
    getEventsByUserId as getEventsByUserIdRepo
} from "../repositories/event_attendees.repository.js";

import { getEventById as getEventByIdRepo } from "../repositories/events.repository.js";
import { getUserById as getUserByIdRepo } from "../repositories/users.repository.js";

export async function registerToAnEvent(userId, eventId) {

    await getEventByIdRepo(eventId);

    await getUserByIdRepo(userId);

    const checkRegistration = await checkIfRegisteredRepo(userId, eventId);

    if (checkRegistration) {
        throw new ConflictError('This is already registered to this event.');
    }

    const registration = await registerToEventRepo(userId, eventId);

    return registration;
} 

export async function getAttendeesByEventId(eventId) {

    await getEventByIdRepo(eventId);

    const allAttendeesByEventId = await getAttendeesByEventIdRepo(eventId);

    return allAttendeesByEventId.map( eventAttendee => eventAttendee.toPublic());
}

export async function getEventsByUserId(userId) {

    await getUserByIdRepo(userId);

    const allEventsByUserId = await getEventsByUserIdRepo(userId);

    return allEventsByUserId.map( userEvents => userEvents.toPublic());
}