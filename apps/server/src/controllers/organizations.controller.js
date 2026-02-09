import { getOrganizationTestMessage } from '../services/organizations.service.js'

export async function organizationTest(req, res) {

    const org = await getOrganizationTestMessage();
    
    res.json(org);
}