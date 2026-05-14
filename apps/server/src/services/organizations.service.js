import { getOrganizationData, getOrganizationById as getOrganizationByIdRepo, getAllOrganizations as getAllOrganizationsRepo, getOrganizationByEmail, createOrganization as createOrganizationRepo} from '../repositories/organizations.repository.js'
import { getAllEventsByOrganizationId as getEventsByOrganizationId } from '../repositories/events.repository.js';
import ConflictError from '../errors/ConflictError.js';


export async function getOrganizationTestMessage() {

    const org = await getOrganizationData();

    return org.toPublic();
}

export async function getAllEventsByOrganizationId(id) {

    const organization = await getOrganizationById(id);

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

export async function createOrganization(name, email, description, location) {

    const checkEmail = await getOrganizationByEmail(email)

    if (checkEmail === null) {

        const createdOrganzation = await createOrganizationRepo(name, email, description, location);

        return createdOrganzation.toPublic();
        
    } else {

        throw new ConflictError('This email already exists/registered');
    }
}