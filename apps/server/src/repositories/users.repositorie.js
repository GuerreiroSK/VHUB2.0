import User from '../entities/User.js'

export function getUserTestData() {
    const user = new User(1, "joao", "joao@email.com", "mock-password");

    return user;
}