import express from 'express'
import { eventsWithOrganizations, eventTest } from '../controllers/events.controller.js'

const testEventsRouter = express.Router();

testEventsRouter.get('/event_test', eventTest);

testEventsRouter.get('/with-organizations', eventsWithOrganizations)

export default testEventsRouter;