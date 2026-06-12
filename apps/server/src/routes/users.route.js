import express from 'express';

import { getAllUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/users.controller.js';
import { getEventsByUserId } from '../controllers/event_attendees.controller.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

userRouter.patch('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

userRouter.get('/:id/events', getEventsByUserId);

export default userRouter;