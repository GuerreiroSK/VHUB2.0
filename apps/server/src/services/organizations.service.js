import { getOrganizationData } from '../repositories/organizations.repositorie.js'

export function getOrganizationTestMessage() {

    const org = getOrganizationData();
    
    return org.toPublic();
}