import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', userController.signUp);

userRouter.post('/login', userController.signIn);

export default userRouter;
