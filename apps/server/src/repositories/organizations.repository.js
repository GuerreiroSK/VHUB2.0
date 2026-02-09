import db_pool from "../db/index.js";
import Organization from "../entities/Organization.js";

export async function getOrganizationData() {

    const result = await db_pool.query(
        'SELECT id, name, email, description, location FROM organizations LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error ('No organization found.');
    }

    const org = new Organization(
        row.id,
        row.name,
        row.email,
        row.description,
        row.location
    );

    return org;
}