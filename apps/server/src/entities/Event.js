class Event {
    constructor(id, eventName, location, organizationId, email, startDateTime, endDateTime, description) {
        this.id = id
        this.eventName = eventName
        this.location = location
        this.organizationId = organizationId
        this.email = email
        this.startDateTime = startDateTime
        this.endDateTime = endDateTime
        this.description = description
    }
    toPublic() {
        return {
            id: this.id,
            eventName: this.eventName,
            location: this.location,
            organizationId: this.organizationId,
            email: this.email,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime,
            description: this.description
        }
    }
}

export default Event;