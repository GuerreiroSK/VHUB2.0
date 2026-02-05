import { getEventData } from '../repositories/events.repositorie.js'

export function getEventTestMessage() {

    const event = getEventData();

    return event.toPublic();
}