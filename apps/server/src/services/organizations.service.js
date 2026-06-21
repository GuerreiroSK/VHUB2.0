import { getOrganizationById as getOrganizationByIdRepo,
    getAllOrganizations as getAllOrganizationsRepo,
    getOrganizationByEmail,
    createOrganization as createOrganizationRepo,
    updateOrganization as updatedOrganizationRepo,
    deleteOrganization as deleteOrganizationRepo
} from '../repositories/organizations.repository.js';

import { getAllEventsByOrganizationId as getEventsByOrganizationId } from '../repositories/events.repository.js';
import ConflictError from '../errors/ConflictError.js';

export async function getAllEventsByOrganizationId(id) {

    const organization = await getOrganizationByIdRepo(id);

    const allEventsByOrgId = await getEventsByOrganizationId(id);

    return allEventsByOrgId.map(event => event.toPublic());

}

export async function getAllOrganizations() {

    const organizations = await getAllOrganizationsRepo();

    return organizations.map(organization => organization.toPublic());
}

export async function getOrganizationById(id) {

    const organization = await getOrganizationByIdRepo(id);

    return organization.toPublic();
}

export async function createOrganization(name, email, description, location, ownerId) {

    const checkEmail = await getOrganizationByEmail(email);

    if (checkEmail !== null) {

        throw new ConflictError('This email already exists/registered');

    }

    const createdOrganization = await createOrganizationRepo(name, email, description, location, ownerId);

    return createdOrganization.toPublic();
}

export async function updateOrganization(id, fields) {

    await getOrganizationByIdRepo(id);

    if (fields.email) {

        const checkEmail = await getOrganizationByEmail(fields.email);

        if (checkEmail !== null && id !== checkEmail.id) {

            throw new ConflictError('This email is already exists.')
        }

    }

    const updatedOrganization = await updatedOrganizationRepo(id, fields);

    return updatedOrganization.toPublic();
}

export async function deleteOrganization(id) {

    await deleteOrganizationRepo(id);
}

