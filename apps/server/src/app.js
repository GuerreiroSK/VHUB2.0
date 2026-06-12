import express from "express";
import usersRouter from "./routes/users.route.js"
import organizationsRouter from "./routes/organizations.route.js"
import eventsRouter from "./routes/events.route.js"

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/events', eventsRouter);

export default app