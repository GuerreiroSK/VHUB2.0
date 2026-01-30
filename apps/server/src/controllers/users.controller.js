import { getUserTestMessage } from "../services/users.service.js";

export function userTest(req, res) {
    res.json(getUserTestMessage());
}