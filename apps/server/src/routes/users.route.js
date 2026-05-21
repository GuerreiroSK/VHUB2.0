import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/users.controller.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

userRouter.patch('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;