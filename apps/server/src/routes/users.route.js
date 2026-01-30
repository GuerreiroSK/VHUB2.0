import express from 'express'
import { userTest } from '../controllers/users.controller.js'

const testUserRouter = express.Router();

testUserRouter.get('/user_test', userTest);

export default testUserRouter;