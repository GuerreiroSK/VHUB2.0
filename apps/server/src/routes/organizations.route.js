import express from 'express'
import { organizationTest } from '../controllers/organizations.controller.js'

const testOrganizationsRouter = express.Router();

testOrganizationsRouter.get('/organization_test', organizationTest);

export default testOrganizationsRouter;