import db_pool from '../db/index.js';
import Event from '../entities/Event.js'
import NotFoundError from '../errors/NotFoundError.js';

export async function getEventData() {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events LIMIT 1'
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
        row.email,
        row.start_datetime,
        row.end_datetime
    );

    return event;
}

export async function getEventById(id) {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE id = $1 AND deleted_at IS NULL',
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
        row.email,
        row.start_datetime,
        row.end_datetime
    );

    return event;
}

export async function getAllEvents(limit, offset) {

    let result;

    if (limit === undefined || offset === undefined) {
        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE deleted_at IS NULL ORDER BY id'
        );
    } else {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        )
    }

    const rows = result.rows;

    if (rows.length === 0) {
        return [];
    }

    const allEvents = rows.map(row => {

        return new Event(
            row.id,
            row.name,
            row.location,
            row.organization_id,
            row.email,
            row.start_datetime,
            row.end_datetime
        )
    })

    return allEvents;
}

export async function getAllEventsByOrganizationId(id) {

    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE organization_id = $1 AND deleted_at IS NULL',
        [id]
    );

    const allEventsMap = result.rows.map( row => new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email,
        row.start_datetime,
        row.end_datetime
    ))

    return allEventsMap;
}

export async function getEventsByOrganizationId(organizationId, limit, offset) {

    let result;

    if (limit === undefined || offset === undefined) {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE deleted_at IS NULL AND organization_id = $1 ORDER BY id',
            [organizationId]
        );

    } else {

        result = await db_pool.query(
            'SELECT id, name, location, organization_id, email, start_datetime, end_datetime FROM events WHERE deleted_at IS NULL AND organization_id = $1 ORDER BY id LIMIT $2 OFFSET $3',
            [organizationId, limit, offset]
        );
    }

    const eventsMap = result.rows.map(row => new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email,
        row.start_datetime,
        row.end_datetime
    ))

    return eventsMap;
}

export async function createEvent(eventName, location, email, organizationId, startDateTime, endDateTime) {

    const result = await db_pool.query(
        'INSERT INTO events (name, location, email, organization_id, start_datetime, end_datetime) VALUES ($1 , $2, $3, $4, $5, $6) RETURNING id, name, location, email, organization_id, start_datetime, end_datetime',
        [eventName, location, email, organizationId, startDateTime || null, endDateTime || null]
    );

    const row = result.rows[0];

    const newEvent = new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email,
        row.start_datetime,
        row.end_datetime
    );

    return newEvent;
}

export async function updateEvent(id, fields) {

    const setClauses = [];
    const values = [];

    Object.entries(fields).forEach(([key, value]) => {

        setClauses.push(`${key} = $${setClauses.length + 1}`);
        values.push(value);
    });

    values.push(id);

    const result = await db_pool.query(
        `UPDATE events SET ${setClauses.join(', ')} WHERE id = $${values.length} AND deleted_at IS NULL RETURNING id, name, location, organization_id, email, start_datetime, end_datetime`,
        values
    );

    const row = result.rows[0];

    if (!row) {
        throw new NotFoundError('Event not found');
    }

    return new Event(
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.email,
        row.start_datetime,
        row.end_datetime
    );
}

export async function deleteEvent(id) {

    const result = await db_pool.query(
        'UPDATE events SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
        [id]
    );

    if (result.rowCount === 0) {
        throw new NotFoundError('Event not found');
    }
}