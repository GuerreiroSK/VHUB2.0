import db_pool from "../db/index.js";
import Organization from "../entities/Organization.js";
import NotFoundError from "../errors/NotFoundError.js";

export async function getOrganizationById(id) {

    const result = await db_pool.query(
        'SELECT id, name, email, description, location FROM organizations WHERE id = $1 AND deleted_at IS NULL',
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
        'SELECT id, name, email, description, location FROM organizations WHERE deleted_at IS NULL'
    );

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allOrganizations = rows.map(row => {

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

export async function getOrganizationByEmail(email) {

    const result = await db_pool.query(
        'SELECT id, email FROM organizations WHERE email = $1',
        [email]
    );

    const row = result.rows[0];

    if (!row) {
        return null
    }

    return row;
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

export async function updateOrganization(id, fields) {

    const setClauses = [];
    const values = [];

    Object.entries(fields).forEach(([key, value]) => {

        setClauses.push(`${key} = $${setClauses.length + 1}`);
        values.push(value);

    });

    values.push(id);

    const result = await db_pool.query(
        `UPDATE organizations SET ${setClauses.join(', ')} WHERE id = $${values.length} AND deleted_at IS NULL RETURNING id, name, email, description, location`,
        values
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

export async function deleteOrganization(id) {

    const result = await db_pool.query(
        'UPDATE organizations SET deleted_at = NOW() WHERE id =$1 AND deleted_at IS NULL',
        [id]
    );

    const row = result.rowCount;

    if(row === 0) {
        throw new NotFoundError ('Organization not found');
    }
}