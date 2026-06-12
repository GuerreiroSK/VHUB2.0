import express from 'express';

import { eventsWithOrganizations, getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller.js';
import { registerToAnEvent, getAttendeesByEventId, cancelRegistration } from '../controllers/event_attendees.controller.js';

const eventsRouter = express.Router();

eventsRouter.get('/with-organizations', eventsWithOrganizations);

eventsRouter.get('/', getEvents);

eventsRouter.get('/:id', getEventById);

eventsRouter.post('/', createEvent );

eventsRouter.patch('/:id', updateEvent);

eventsRouter.delete('/:id', deleteEvent);

eventsRouter.post('/:id/attendees', registerToAnEvent);

eventsRouter.get('/:id/attendees', getAttendeesByEventId);

eventsRouter.delete('/:id/attendees/:userId', cancelRegistration);

export default eventsRouter;