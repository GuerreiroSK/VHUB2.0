import { getEventData } from '../repositories/events.repository.js'

export function getEventTestMessage() {

    const event = getEventData();

    return event.toPublic();
}