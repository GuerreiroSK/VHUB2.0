class Event {
    constructor(id, eventName, location, organizationId, email) {
        this.id = id
        this.eventName = eventName
        this.location = location, 
        this.organizationId = organizationId
        this.email = email
    }
    toPublic() {
        return {
            id: this.id,
            eventName: this.eventName,
            location: this.location,
            organizationId: this.organizationId,
            email: this.email
        }
    }
}

export default Event;