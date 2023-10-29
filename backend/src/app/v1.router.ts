import { Router } from 'express';
import userRouter from '../routes/user.route';
import listRouter from '../routes/list.route';
import AuthMiddleware from '../middleware/auth.middleware';

const v1Router = Router();

v1Router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'The application is healthy.'
  }); // Health check endpoint
});

v1Router.use('/users', userRouter);
v1Router.use('/lists', AuthMiddleware.verifyToken, listRouter);

export default v1Router;
