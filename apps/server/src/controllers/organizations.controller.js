import { getOrganizationTestMessage } from '../services/organizations.service.js'

export function organizationTest(req, res) {
    res.json(getOrganizationTestMessage());
}