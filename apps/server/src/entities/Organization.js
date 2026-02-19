class Organization {
    constructor(id, name, email, description, location) {
        this.id = id
        this.name = name
        this.email = email
        this.description = description
        this.location = location
    }
    toPublic() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            description: this.description,
            location: this.location
        }
    }
}

export default Organization;