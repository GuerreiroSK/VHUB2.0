class EventAttendee {
    constructor( userId, eventId, createdAt) {
        this.userId = userId
        this.eventId = eventId
        this.createdAt = createdAt
    }

    toPublic() {
        return {
            userId: this.userId,
            eventId: this.eventId,
            createdAt: this.createdAt
        }
    }
}

export default EventAttendee;