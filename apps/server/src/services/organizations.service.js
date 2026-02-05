import { getOrganizationData } from '../repositories/organizations.repository.js'

export function getOrganizationTestMessage() {

    const org = getOrganizationData();
    
    return org.toPublic();
}