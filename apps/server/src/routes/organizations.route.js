import express from 'express'
import { organizationTest, getAllEventsByOrganizationId, getAllOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../controllers/organizations.controller.js'

const testOrganizationsRouter = express.Router();

testOrganizationsRouter.get('/organization_test', organizationTest);

testOrganizationsRouter.get('/', getAllOrganizations);

testOrganizationsRouter.get('/:id', getOrganizationById);

testOrganizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

testOrganizationsRouter.post('/', createOrganization);

testOrganizationsRouter.patch('/:id', updateOrganization);

export default testOrganizationsRouter;