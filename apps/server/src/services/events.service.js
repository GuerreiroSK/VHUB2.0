import { getEventData } from '../repositories/events.repositorie.js'

export function getEventTestMessage() {
    return getEventData();
}