import { getOrganizationTestMessage, getAllEventsByOrganizationId as getEventsByOrgId } from '../services/organizations.service.js'
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

    try {
        const id = req.params.id

        const allEvents = await getEventsByOrgId(id);

        return res.json(allEvents)

    } catch (err) {
        
        return res.status(500).json({ message: 'Internal server error.'});
    }
}