import express from 'express';
import { userTest, getAllUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/users.controller.js';

const testUsersRouter = express.Router();

testUsersRouter.get('/user_test', userTest);

testUsersRouter.get('/', getAllUsers);

testUsersRouter.get('/:id', getUserById);

testUsersRouter.post('/', createUser);

testUsersRouter.patch('/:id', updateUser);

testUsersRouter.delete('/:id', deleteUser);

export default testUsersRouter;