import db_pool from "../db/index.js";
import EventAttendee from "../entities/EventAttendee.js";

export async function registerToEvent(userId, eventId) {

    const result = await db_pool.query(
        'INSERT INTO event_attendees (user_id, event_id) VALUES ($1 , $2) RETURNING user_id, event_id, created_at',
        [userId, eventId]
    )

    const row = result.rows[0];

    return new EventAttendee(
        row.user_id,
        row.event_id,
        row.created_at
    )
}


export async function checkIfRegistered(userId, eventId) {

    const result = await db_pool.query(
        'SELECT user_id, event_id FROM event_attendees WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
    )

    const row = result.rows[0];

    if (!row) {
        return null
    }

    return new EventAttendee(
        row.user_id,
        row.event_id,
        row.created_at
    )
}

export async function getAttendeesByEventId(eventId) {

    const result = await db_pool.query(
        'SELECT user_id, event_id, created_at FROM event_attendees WHERE event_id = $1 AND deleted_at IS NULL',
        [eventId]
    )

    if (result.rows.length === 0) {

        return [];
    }

    const allAttendeesByEventId = result.rows.map( row => new EventAttendee(
        
        row.user_id,
        row.event_id,
        row.created_at

    ))

    return allAttendeesByEventId;
}