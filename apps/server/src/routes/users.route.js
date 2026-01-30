import express from 'express'
import { userTest } from '../controllers/users.controller.js'

const testUsersRouter = express.Router();

testUsersRouter.get('/user_test', userTest);

export default testUsersRouter;