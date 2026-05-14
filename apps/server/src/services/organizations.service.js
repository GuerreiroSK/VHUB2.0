import { getOrganizationData, getOrganizationById as getOrganizationByIdRepo, getAllOrganizations as getAllOrganizationsRepo} from '../repositories/organizations.repository.js'
import { getAllEventsByOrganizationId as getEventsByOrganizationId } from '../repositories/events.repository.js';


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