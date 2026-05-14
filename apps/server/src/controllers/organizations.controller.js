import { getOrganizationTestMessage, getAllEventsByOrganizationId as getEventsByOrgId, getAllOrganizations as getAllOrganizationsService, getOrganizationById as getOrganizationByIdService, createOrganization as createOrganizationService, updateOrganization as updateOrganizationService } from '../services/organizations.service.js'
import NotFoundError from '../errors/NotFoundError.js';
import ConflictError from '../errors/ConflictError.js';

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

        res.status(500).json({ message: 'Internal server error' });
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

        } else {

            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export async function createOrganization(req, res) {

    const { name, email, description, location } = req.body;

    if (!name || !email || !location) {

        return res.status(400).json({ message: 'Name, Email and Location fields cannot be empty' });
    }

    try {

        const createdOrganzation = await createOrganizationService(name, email, description, location);

        return res.status(201).json(createdOrganzation);

    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message });

        } else {

            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export async function updateOrganization(req, res) {

    const organizationId = Number(req.params.id);

    const { name, email, description, location} = req.body;

    const fields = {};

    if (name !== undefined) fields.name = name;
    if (email !== undefined) fields.email = email;
    if (description !== undefined) fields.description = description;
    if (location !== undefined) fields.location = location;

    if (!Number.isInteger(organizationId) || organizationId <= 0) {

        return res.status(400).json({ message: 'id must be a positive integer' });

    } else if (Object.keys(fields).length === 0) {

        return res.status(400).json({ message: 'No fields were updated' });

    }

    try {

        const updatedOrganization = await updateOrganizationService(organizationId, fields);

        return res.status(200).json(updatedOrganization);

    } catch (err) {

        if (err instanceof ConflictError) {

            return res.status(409).json({ message: err.message });

        } else if (err instanceof NotFoundError) {

            return res.status(404).json({ message: 'Organization not found' });
        } else {

            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}