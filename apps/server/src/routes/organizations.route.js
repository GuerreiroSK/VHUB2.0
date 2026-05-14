import express from 'express'
import { organizationTest, getAllEventsByOrganizationId, getAllOrganizations } from '../controllers/organizations.controller.js'

const testOrganizationsRouter = express.Router();

testOrganizationsRouter.get('/organization_test', organizationTest);

testOrganizationsRouter.get('/', getAllOrganizations);

testOrganizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

export default testOrganizationsRouter;