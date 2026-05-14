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
        throw new NotFoundError ('Organization not found.');
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

export async function createOrganization(name, email, description, location) {

    const result = await db_pool.query(
        'INSERT INTO organizations (name, email, description, location) VALUES ($1 , $2, $3, $4) RETURNING id, name, email, description, location',
        [name, email, description, location]
    );

    const row = result.rows[0];

    const newOrganzation = new Organization(

            row.id,
            row.name,
            row.email,
            row.description,
            row.location
        )

    return newOrganzation;
}

export async function getOrganizationByEmail(email) {

    const result = await db_pool.query(
        'SELECT email FROM organizations WHERE email = $1',
        [email]
    );

    const row = result.rows[0];

    if (!row) {
        return null
    }

    return row;
}