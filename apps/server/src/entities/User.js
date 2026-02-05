class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    toPublic() {
       return { 
            id: this.id,
            name: this.name, 
            email: this.email
        }
    }
}

export default User;