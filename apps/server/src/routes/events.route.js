import express from 'express';

import { eventsWithOrganizations, getEvents, eventTest, getEventById, createEvent, updateEvent } from '../controllers/events.controller.js';

const testEventsRouter = express.Router();

testEventsRouter.get('/event_test', eventTest);

testEventsRouter.get('/with-organizations', eventsWithOrganizations);

testEventsRouter.get('/', getEvents);

testEventsRouter.get('/:id', getEventById);

testEventsRouter.post('/', createEvent );

testEventsRouter.patch('/:id', updateEvent);

export default testEventsRouter;