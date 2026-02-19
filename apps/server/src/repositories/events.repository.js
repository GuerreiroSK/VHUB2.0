import db_pool from '../db/index.js';
import Event from '../entities/Event.js'

export async function getEventData() {
    
    const result = await db_pool.query(
        'SELECT id, name, location, organization_id, contact_email FROM events LIMIT 1'
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error ('No events found.');
    }

    const event = new Event (
        row.id,
        row.name,
        row.location,
        row.organization_id,
        row.contact_email
    );

    return event;
}