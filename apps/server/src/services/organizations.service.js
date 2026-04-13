import { getOrganizationData } from '../repositories/organizations.repository.js'
import { getAllEventsByOrganizationId as getEventsByOrganizationId } from '../repositories/events.repository.js';

export async function getOrganizationTestMessage() {

    const org = await getOrganizationData();
    
    return org.toPublic();
}

export async function getAllEventsByOrganizationId(id) {

    const allEventsByOrgId = await getEventsByOrganizationId(id);

    return allEventsByOrgId.map(event => event.toPublic())
}