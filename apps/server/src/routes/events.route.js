import express from 'express'
import { eventsWithOrganizations, getEvents, eventTest, getEventById } from '../controllers/events.controller.js'

const testEventsRouter = express.Router();

testEventsRouter.get('/event_test', eventTest);

testEventsRouter.get('/with-organizations', eventsWithOrganizations);

testEventsRouter.get('/', getEvents);

testEventsRouter.get('/:id', getEventById)

export default testEventsRouter;