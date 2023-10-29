import { Router } from 'express';
import listController from '../controllers/list.controller';

const listRouter = Router();

listRouter.post('/', listController.createList);
listRouter.post('/:listID/task', listController.createTask);
listRouter.get('/', listController.getLists);
listRouter.patch('/task/move', listController.moveTask);
listRouter.patch('/task/:taskID', listController.updateTaskStatus);
listRouter.delete('/task/:taskID', listController.deleteTask);

export default listRouter;
