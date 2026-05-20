import express from 'express';

import { eventsWithOrganizations, getEvents, eventTest, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller.js';

const testEventsRouter = express.Router();

testEventsRouter.get('/event_test', eventTest);

testEventsRouter.get('/with-organizations', eventsWithOrganizations);

testEventsRouter.get('/', getEvents);

testEventsRouter.get('/:id', getEventById);

testEventsRouter.post('/', createEvent );

testEventsRouter.patch('/:id', updateEvent);

testEventsRouter.delete('/:id', deleteEvent);

export default testEventsRouter;