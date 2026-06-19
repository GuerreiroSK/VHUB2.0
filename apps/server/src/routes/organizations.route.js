import express from 'express';
import { getAllEventsByOrganizationId, 
     getAllOrganizations, 
     getOrganizationById, 
     createOrganization, 
     updateOrganization, 
     deleteOrganization 
    } from '../controllers/organizations.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const organizationsRouter = express.Router();

organizationsRouter.get('/', getAllOrganizations);

organizationsRouter.get('/:id', getOrganizationById);

organizationsRouter.get('/:id/events', getAllEventsByOrganizationId);

organizationsRouter.post('/', verifyToken, requireRole(['admin', 'developer']) ,createOrganization);

organizationsRouter.patch('/:id', verifyToken, requireRole(['admin', 'developer']),updateOrganization);

organizationsRouter.delete('/:id', verifyToken, requireRole(['admin', 'developer']) ,deleteOrganization);

export default organizationsRouter;