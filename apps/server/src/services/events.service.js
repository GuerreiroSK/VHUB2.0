import { getEventData } from '../repositories/events.repository.js'

export async function getEventTestMessage() {

    const event = await getEventData();

    return event.toPublic();
}