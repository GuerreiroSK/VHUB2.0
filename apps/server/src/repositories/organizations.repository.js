import Organization from "../entities/Organization.js";

export async function getOrganizationData() {

    const org = new Organization(
        1,
        "Help is on the way",
        "ontheway@help.com",
        "test-password",
        "Helping those in need.",
        "Lisbon"
    )
    return org;
}