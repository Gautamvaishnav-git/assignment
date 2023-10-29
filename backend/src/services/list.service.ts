import { z } from 'zod';
import { listModel, listSchema, type ListType } from '../model/list.model';
import { taskModel, taskSchema, type TaskType } from '../model/task.model';
import { getLoggerInstance } from './logger.service';

export const moveTaskSchema = z.object({
  from: z.object({
    listID: z.number(),
    taskID: z.number()
  }),
  to: z.object({
    listID: z.number(),
    taskID: z.number()
  })
});

export type MoveTask = z.infer<typeof moveTaskSchema>;

class ListService {
  private readonly listModel = listModel;
  private readonly taskModel = taskModel;

  public createList = async (
    name: string,
    userID: number
  ): Promise<ListType> => {
    try {
      const parsed = listSchema.parse({
        listName: name,
        createdBy: userID,
        updatedBy: userID
      });
      const list = await this.listModel.create({ ...parsed });
      return list;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public getLists = async (userID: number): Promise<ListType[]> => {
    try {
      const lists = await this.listModel.findAll({
        where: { createdBy: userID },
        include: [
          {
            model: this.taskModel,
            as: 'tasks',
            where: { isActive: true },
            required: false
          }
        ]
      });
      return lists;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public createTask = async (
    listID: number,
    data: TaskType
  ): Promise<TaskType> => {
    try {
      const parsed = taskSchema.parse({
        ...data,
        listID
      } satisfies TaskType);
      const task = await this.taskModel.create({ ...parsed });
      return task;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public moveTask = async (data: MoveTask): Promise<TaskType> => {
    try {
      const { to } = moveTaskSchema.parse(data);
      const task = await this.taskModel.findOne({
        where: { taskID: data.from.taskID, listID: data.from.listID }
      });
      if (!task) {
        throw new Error('Task not found');
      }
      const updatedTask = await task.update({ listID: to.listID });
      return updatedTask;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public updateTaskStatus = async (
    taskID: number,
    status: TaskType['status']
  ): Promise<TaskType> => {
    try {
      const task = await this.taskModel.findOne({ where: { taskID } });
      if (!task) {
        throw new Error('Task not found');
      }
      const updatedTask = await task.update({ status });
      return updatedTask;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public deleteTask = async (taskID: number): Promise<TaskType> => {
    try {
      const task = await this.taskModel.findOne({ where: { taskID } });
      if (!task) {
        throw new Error('Task not found');
      }
      const updatedTask = await task.update({ isActive: false });
      return updatedTask;
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };
}

export default ListService;
