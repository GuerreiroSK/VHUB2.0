import { getEventTestMessage } from '../services/events.service.js'

export async function eventTest (req, res) {

    const event = await getEventTestMessage();

    res.json(event);
}