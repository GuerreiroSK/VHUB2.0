import express from 'express';

import { eventsWithOrganizations, getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller.js';
import { registerToAnEvent, getAttendeesByEventId, cancelRegistration } from '../controllers/event_attendees.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const eventsRouter = express.Router();

eventsRouter.get('/with-organizations', eventsWithOrganizations);

eventsRouter.get('/', getEvents);

eventsRouter.get('/:id', getEventById);

eventsRouter.post('/', verifyToken, createEvent );

eventsRouter.patch('/:id', verifyToken, updateEvent);

eventsRouter.delete('/:id', verifyToken, deleteEvent);

eventsRouter.post('/:id/attendees', verifyToken, registerToAnEvent);

eventsRouter.get('/:id/attendees', getAttendeesByEventId);

eventsRouter.delete('/:id/attendees/:userId', verifyToken, cancelRegistration);

export default eventsRouter;