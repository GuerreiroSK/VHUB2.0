class Organization {
    constructor(id, orgName, email, password, description, location) {
        this.id = id
        this.orgName = orgName
        this.email = email
        this.password = password
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