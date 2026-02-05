class Event {
    constructor(id, eventName, location, organizationId, contactEmail) {
        this.id = id
        this.eventName = eventName
        this.location = location, 
        this.organizationId = organizationId
        this.contactEmail = contactEmail
    }
    toPublic() {
        return {
            id: this.id,
            eventName: this.eventName,
            location: this.location,
            organizationId: this.organizationId,
            contactEmail: this.contactEmail
        }
    }
}

export default Event;