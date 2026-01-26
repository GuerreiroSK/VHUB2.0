import express from "express";
import testUserRoutes from "./routes/users.js"
import testOrganizationsRoutes from "./routes/organizations.js"
import testEventsRoutes from "./routes/events.js"

const app = express();

app.use('/api/users', testUserRoutes);
app.use('/api/organizations', testOrganizationsRoutes);
app.use('/api/events', testEventsRoutes);

export default app