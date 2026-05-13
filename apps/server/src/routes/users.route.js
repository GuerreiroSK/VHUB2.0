import express from 'express'
import { userTest, getAllUsers} from '../controllers/users.controller.js'

const testUsersRouter = express.Router();

testUsersRouter.get('/user_test', userTest);

testUsersRouter.get('/', getAllUsers);

export default testUsersRouter;