import { getEventTestMessage } from '../services/events.service.js'

export function eventTest (req, res) {
    res.json(getEventTestMessage());
}