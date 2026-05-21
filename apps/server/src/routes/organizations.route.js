import express from 'express'
import { getAllEventsByOrganizationId, 
     getAllOrganizations, 
     getOrganizationById, 
     createOrganization, 
     updateOrganization, 
     deleteOrganization 
    } from '../controllers/organizations.controller.js'

const OrganizationsRouter = express.Router();

OrganizationsRouter.get('/', getAllOrganizations);

OrganizationsRouter.get('/:id', getOrganizationById);

OrganizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

OrganizationsRouter.post('/', createOrganization);

OrganizationsRouter.patch('/:id', updateOrganization);

OrganizationsRouter.delete('/:id', deleteOrganization);

export default OrganizationsRouter;