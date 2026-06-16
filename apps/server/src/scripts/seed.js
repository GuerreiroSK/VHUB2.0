import db_pool from '../db/index.js';
import { registerToAnEvent } from '../services/event_attendees.service.js';
import { createEvent } from '../services/events.service.js';
import { createOrganization } from '../services/organizations.service.js';
import { createUser } from '../services/users.service.js';

await db_pool.query(
    'TRUNCATE TABLE event_attendees, events, organizations, users RESTART IDENTITY CASCADE'
);

console.log('🗑️ Database cleared');

const usersData = [
    { name: 'User1', email: 'user1@email.com', password: '123' },
    { name: 'User2', email: 'user2@email.com', password: '123' },
    { name: 'User3', email: 'user3@email.com', password: '123' },
    { name: 'User4', email: 'user4@email.com', password: '123' },
    { name: 'User5', email: 'user5@email.com', password: '123' }
];

const createdUsers = [];

for (const newEntry of usersData) {

    const newUser = await createUser(newEntry.name, newEntry.email, newEntry.password);

    createdUsers.push(newUser);
};

console.log('✅ Users created:', createdUsers.length);

const orgsData = [
    { name: 'Org1', email: 'org1@email.com', description: 'Organization 1', location: 'Lisboa'},
    { name: 'Org2', email: 'org2@email.com', description: 'Organization 2', location: 'Porto'},
    { name: 'Org3', email: 'org3@email.com', description: 'Organization 3', location: 'Sesimbra'},
    { name: 'Org4', email: 'org4@email.com', description: 'Organization 4', location: 'Setúbal'},
    { name: 'Org5', email: 'org5@email.com', description: 'Organization 5', location: 'Lagos'}
];

const createdOrgs = [];

for (const newEntry of orgsData) {

    const newOrg = await createOrganization(newEntry.name, newEntry.email, newEntry.description, newEntry.location);

    createdOrgs.push(newOrg);
};

console.log('✅ Organizations created:', createdOrgs.length);

const eventsData = [
    { eventName: '1st Event', location: 'Lisboa', email: 'event1@email.com', startDateTime: '2025-06-20T10:00:00Z', endDateTime: '2025-06-22T15:00:00Z' },
    { eventName: '2nd Event', location: 'Porto', email: 'event2@email.com', startDateTime: '2025-06-25T10:00:00Z', endDateTime: '2025-06-25T15:00:00Z' },
    { eventName: '3rd Event', location: 'Sesimbra', email: 'event3@email.com', startDateTime: '2025-06-28T10:00:00Z', endDateTime: '2025-06-29T15:00:00Z' },
    { eventName: '4th Event', location: 'Setúbal', email: 'event4@email.com', startDateTime: '2025-07-01T10:00:00Z', endDateTime: '2025-07-02T15:00:00Z' },
    { eventName: '5th Event', location: 'Lagos', email: 'event5@email.com',startDateTime: '2025-07-03T10:00:00Z', endDateTime: '2025-07-03T15:00:00Z' }
];

const createdEvents = [];

for (let i = 0; i < eventsData.length; i++) {

    const newEvent = await createEvent(
        eventsData[i].eventName,
        eventsData[i].location,
        eventsData[i].email,
        createdOrgs[i].id,
        eventsData[i].startDateTime,
        eventsData[i].endDateTime
    )

    createdEvents.push(newEvent);
};

console.log('✅ Events created:', createdEvents.length);

const attendeesData = [
    { userId: createdUsers[0].id, eventId: createdEvents[0].id },
    { userId: createdUsers[1].id, eventId: createdEvents[1].id },
    { userId: createdUsers[2].id, eventId: createdEvents[2].id },
    { userId: createdUsers[3].id, eventId: createdEvents[3].id },
    { userId: createdUsers[4].id, eventId: createdEvents[4].id }
];

for ( const newEntry of attendeesData) {

    await registerToAnEvent(newEntry.userId, newEntry.eventId);
}

console.log('✅ Attendees registered!');