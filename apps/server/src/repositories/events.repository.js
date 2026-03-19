import db_pool from '../db/index.js';
import Event from '../entities/Event.js'
import NotFoundError from '../errors/NotFoundError.js';

export async function getEventData() {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email FROM events LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError('No events found.');
    }

    const event = new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email
    );

    return event;
}

export async function getEventById(id) {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email FROM events WHERE id = $1',
        [id]
    )

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError('Event not found.');
    }

    const event = new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email
    );

    return event;
}

export async function getAllEvents(limit, offset) {

    let result;

    if (limit === undefined || offset === undefined) {
        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email FROM events ORDER BY id'
        );
    } else {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email FROM events ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        )
    }

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allEvents = rows.map(row => {

        if (!row.organization_id) {
            throw new Error(`Event with id: ${row.id} has no organization_id`);
        }

        return new Event(
            row.id,
            row.name,
            row.location,
            row.organization_id,
            row.email
        )
    })

    return allEvents;
}

export async function getEventsByOrganizationId(organizationId, limit, offset) {

    let result;

    if (limit === undefined || offset === undefined) {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email FROM events WHERE organization_id = $1 ORDER BY id',
            [organizationId]
        );

    } else {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email FROM events WHERE organization_id = $1 ORDER BY id LIMIT $2 OFFSET $3',
            [organizationId, limit, offset]
        );
    }

    const eventsMap = result.rows.map(row => new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email
    ))

    return eventsMap;
}