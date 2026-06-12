import express from 'express'
import { getAllEventsByOrganizationId, 
     getAllOrganizations, 
     getOrganizationById, 
     createOrganization, 
     updateOrganization, 
     deleteOrganization 
    } from '../controllers/organizations.controller.js'

const organizationsRouter = express.Router();

organizationsRouter.get('/', getAllOrganizations);

organizationsRouter.get('/:id', getOrganizationById);

organizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

organizationsRouter.post('/', createOrganization);

organizationsRouter.patch('/:id', updateOrganization);

organizationsRouter.delete('/:id', deleteOrganization);

export default organizationsRouter;