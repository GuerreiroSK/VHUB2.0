import express from "express";
import cors from 'cors'
import usersRouter from "./routes/users.route.js"
import organizationsRouter from "./routes/organizations.route.js"
import eventsRouter from "./routes/events.route.js"
import authRouter from "./routes/auth.route.js";


const app = express();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/users', usersRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);

export default app