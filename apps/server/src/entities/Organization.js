class Organization {
    constructor(id, orgName, email, description, location) {
        this.id = id
        this.orgName = orgName
        this.email = email
        this.description = description
        this.location = location
    }
    toPublic() {
        return {
            id: this.id,
            orgName: this.orgName,
            email: this.email,
            description: this.description,
            location: this.location
        }
    }
}

export default Organization;