import db_pool from "../db/index.js";
import Organization from "../entities/Organization.js";
import NotFoundError from "../errors/NotFoundError.js";

export async function getOrganizationData() {

    const result = await db_pool.query(
        'SELECT id, name, email, description, location FROM organizations LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError ('No organization found.');
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

export async function getOrganizationById(id) {

    const result = await db_pool.query(
        'SELECT id, name, email, description, location FROM organizations WHERE id = $1',
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error ('Organization not found.');
    }

    return new Organization(
        row.id,
        row.name,
        row.email,
        row.description,
        row.location
    );
}

export async function getAllOrganizations() {

    const result = await db_pool.query(
        'SELECT id, name, email, description, location FROM organizations'
    );

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allOrganizations = rows.map(row => {

        if (!row.id || !row.name) {
            throw new Error (`Invalid organization data for row with id: ${row.id}`);
        }

        return new Organization(
            row.id,
            row.name,
            row.email,
            row.description,
            row.location
        )
    });
    
    return allOrganizations;
}