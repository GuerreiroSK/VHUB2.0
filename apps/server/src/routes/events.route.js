import express from 'express'
import { eventTest } from '../controllers/events.controller.js'

const testEventsRouter = express.Router();

testEventsRouter.get('/event_test', eventTest);

export default testEventsRouter;