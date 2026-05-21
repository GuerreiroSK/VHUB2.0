import express from 'express';
import { userTest, getAllUsers, getUserById, createUser} from '../controllers/users.controller.js';

const testUsersRouter = express.Router();

testUsersRouter.get('/user_test', userTest);

testUsersRouter.get('/', getAllUsers);

testUsersRouter.get('/:id', getUserById);

testUsersRouter.post('/', createUser);

export default testUsersRouter;