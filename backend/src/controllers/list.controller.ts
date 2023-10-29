import type { Response } from 'express';
import type { ListType } from '../model/list.model';
import { type TaskType } from '../model/task.model';
import ListService, { type MoveTask } from '../services/list.service';
import { getLoggerInstance } from '../services/logger.service';
import type { RequestWithUser } from '../types/request';

class ListController {
  private readonly listService = new ListService();
  public createList = async (
    req: RequestWithUser<ListType['listName']>,
    res: Response
  ): Promise<unknown> => {
    try {
      const { user, data } = req.body;
      const list = await this.listService.createList(data, user.userID);
      return res.status(201).json(list);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  public getLists = async (
    req: RequestWithUser,
    res: Response
  ): Promise<unknown> => {
    try {
      const { user } = req.body;
      const lists = await this.listService.getLists(user.userID);
      return res.status(200).json(lists);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  public createTask = async (
    req: RequestWithUser<TaskType, { listID: number }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { data } = req.body;
      const task = await this.listService.createTask(+req.params.listID, data);
      return res.status(201).json(task);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  public moveTask = async (
    req: RequestWithUser<MoveTask>,
    res: Response
  ): Promise<unknown> => {
    try {
      const task = await this.listService.moveTask(req.body.data);
      return res.status(200).json(task);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  public updateTaskStatus = async (
    req: RequestWithUser<{ status: TaskType['status'] }, { taskID: number }>,
    res: Response
  ): Promise<Response> => {
    try {
      if (!req.body.data.status) {
        throw new Error('Status is required to update task');
      }
      const task = await this.listService.updateTaskStatus(
        req.params.taskID,
        req.body.data.status
      );
      return res.status(200).json(task);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  public deleteTask = async (
    req: RequestWithUser<unknown, { taskID: number }>,
    res: Response
  ): Promise<Response> => {
    try {
      const task = await this.listService.deleteTask(req.params.taskID);
      return res.status(200).json(task);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };
}

export default new ListController();
