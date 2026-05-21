import express from 'express';

import { eventsWithOrganizations, getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller.js';

const EventsRouter = express.Router();

EventsRouter.get('/with-organizations', eventsWithOrganizations);

EventsRouter.get('/', getEvents);

EventsRouter.get('/:id', getEventById);

EventsRouter.post('/', createEvent );

EventsRouter.patch('/:id', updateEvent);

EventsRouter.delete('/:id', deleteEvent);

export default EventsRouter;