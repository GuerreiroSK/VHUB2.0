class Organization {
    constructor(id, name, email, description, location, ownerId) {
        this.id = id
        this.name = name
        this.email = email
        this.description = description
        this.location = location
        this.ownerId = ownerId
    }
    toPublic() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            description: this.description,
            location: this.location,
            ownerId: this.ownerId
        }
    }
}

export default Organization;