import express from "express";
import testUserRouter from "./routes/users.route.js"
import testOrganizationsRouter from "./routes/organizations.route.js"
import testEventsRouter from "./routes/events.route.js"

const app = express();

app.use('/api/users', testUserRouter);
app.use('/api/organizations', testOrganizationsRouter);
app.use('/api/events', testEventsRouter);

export default app