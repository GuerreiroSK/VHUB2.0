import { getAllEventsByOrganizationId as getEventsByOrgId, 
    getAllOrganizations as getAllOrganizationsService, 
    getOrganizationById as getOrganizationByIdService, 
    createOrganization as createOrganizationService, 
    updateOrganization as updateOrganizationService,
    deleteOrganization as deleteOrganizationService, 
} from '../services/organizations.service.js';

import NotFoundError from '../errors/NotFoundError.js';
import ConflictError from '../errors/ConflictError.js';

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

            return res.status(404).json({ message: 'Organization not found' })
        }

        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function getAllOrganizations(req, res) {

    try {

        const organizations = await getAllOrganizationsService();

        return res.json(organizations);

    } catch (err) {

        return res.status(500).json({ message: 'Internal server error' });
    }

}

export async function getOrganizationById(req, res) {

    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });
    }

    try {

        const organization = await getOrganizationByIdService(organizationId);

        return res.json(organization);

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: 'Organization not found' });

        }

        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createOrganization(req, res) {

    const { name, email, description, location } = req.body;

    const ownerId = req.userId;

    if (!name || !email || !location) {

        return res.status(400).json({ message: 'Name, Email and Location fields cannot be empty' });
    }

    try {

        const createdOrganzation = await createOrganizationService(name, email, description, location, ownerId);

        return res.status(201).json(createdOrganzation);

    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message });

        }
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateOrganization(req, res) {

    const organizationId = Number(req.params.id);

    const { name, email, description, location} = req.body;

    const fields = {};

    if (name) fields.name = name;
    if (email) fields.email = email;
    if (description) fields.description = description;
    if (location) fields.location = location;

    if (!Number.isInteger(organizationId) || organizationId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });
    } 
    
    if (Object.keys(fields).length === 0) {

        return res.status(400).json({ message: 'No fields were updated' });
    }

    try {

        const updatedOrganization = await updateOrganizationService(organizationId, fields);

        return res.status(200).json(updatedOrganization);

    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message });
        }

        if (err instanceof NotFoundError) {

            return res.status(404).json({ message: 'Organization not found' });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteOrganization(req, res) {

    const organizationId = Number(req.params.id)

    if (!Number.isInteger(organizationId) || organizationId <= 0 ) {

        return res.status(400).json({message: 'id must be a positive integer'})
    }

    try {

        await deleteOrganizationService(organizationId);

        return res.status(204).send();

    } catch (err) {

        if (err instanceof NotFoundError) {

            return res.status(404).json({message: 'Organization not found'});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}