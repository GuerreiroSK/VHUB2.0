import ConflictError from "../errors/ConflictError.js";
import { registerToEvent as registerToEventRepo,
    checkIfRegistered as checkIfRegisteredRepo
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