import express from 'express'
import { userTest, getAllUsers, getUserById} from '../controllers/users.controller.js'

const testUsersRouter = express.Router();

testUsersRouter.get('/user_test', userTest);

testUsersRouter.get('/', getAllUsers);

testUsersRouter.get('/:id', getUserById);

export default testUsersRouter;