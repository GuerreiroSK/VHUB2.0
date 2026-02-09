import { getOrganizationData } from '../repositories/organizations.repository.js'

export async function getOrganizationTestMessage() {

    const org = await getOrganizationData();
    
    return org.toPublic();
}