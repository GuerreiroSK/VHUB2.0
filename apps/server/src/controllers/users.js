import { getTestMessage } from "../services/users.js";

export function test(req, res) {
    res.json(getTestMessage());
}