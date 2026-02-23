import db_pool from '../db/index.js';
import Event from '../entities/Event.js'
import NotFoundError from '../errors/NotFoundError.js';

export async function getEventData() {
    
    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email FROM events LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError ('No events found.');
    }

    const event = new Event (
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email
    );

    return event;
}

export async function getAllEvents() {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email FROM events'
    );

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allEvents = rows.map(row => {

        if (!row.organization_id) {
            throw new Error (`Event with id: ${row.id} has no organization_id`);
        }

        return new Event (
            row.id,
            row.name,
            row.location,
            row.organization_id,
            row.email
        )
    })

    return allEvents;
}

export async function getEventsByOrganizationId(organizationId) {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email FROM events WHERE organization_id = $1',
        [organizationId]
    );

    const eventsMap = result.rows.map(row => new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email
    ))

    return eventsMap;
}