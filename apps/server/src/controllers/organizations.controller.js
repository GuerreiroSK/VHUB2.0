import { getOrganizationTestMessage, getAllEventsByOrganizationId as getEventsByOrgId, getAllOrganizations as getAllOrganizationsService } from '../services/organizations.service.js'
import NotFoundError from '../errors/NotFoundError.js';

export async function organizationTest(req, res) {

    try {
        const org = await getOrganizationTestMessage();

        return res.json(org);

    } catch (err) {
        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

export async function getAllEventsByOrganizationId(req, res) {

     const organizationId = Number(req.params.id)

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            
            return res.status(400).json({ message: "id must be a positive integer" });
        }

    try {

        const allEvents = await getEventsByOrgId(organizationId);

        return res.json(allEvents)

    } catch (err) {
        
        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: 'Organization not found'})
        }

        return res.status(500).json({ message: 'Internal server error.'});
    }
}

export async function getAllOrganizations(req, res) {

    try {

        const organizations = await getAllOrganizationsService();

        return res.json(organizations);

    } catch (err) {

        res.status(500).json({ message: 'Internal server error'});
    } 
    
}