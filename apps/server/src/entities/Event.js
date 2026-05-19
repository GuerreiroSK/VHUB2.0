class Event {
    constructor(id, eventName, location, organizationId, email, startDateTime, endDateTime) {
        this.id = id
        this.eventName = eventName
        this.location = location, 
        this.organizationId = organizationId
        this.email = email
        this.startDateTime = startDateTime
        this.endDateTime = endDateTime
    }
    toPublic() {
        return {
            id: this.id,
            eventName: this.eventName,
            location: this.location,
            organizationId: this.organizationId,
            email: this.email,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime
        }
    }
}

export default Event;