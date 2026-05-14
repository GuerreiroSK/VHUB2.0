import express from 'express'
import { organizationTest, getAllEventsByOrganizationId, getAllOrganizations, getOrganizationById, createOrganization } from '../controllers/organizations.controller.js'

const testOrganizationsRouter = express.Router();

testOrganizationsRouter.get('/organization_test', organizationTest);

testOrganizationsRouter.get('/', getAllOrganizations);

testOrganizationsRouter.get('/:id', getOrganizationById);

testOrganizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

testOrganizationsRouter.post('/', createOrganization);

export default testOrganizationsRouter;