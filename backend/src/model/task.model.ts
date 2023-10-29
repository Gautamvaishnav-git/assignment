import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type Model,
  type ModelStatic,
  type Sequelize
} from 'sequelize';
import { z } from 'zod';
import pgInstance from '../db/pg.db';
import { listModel } from './list.model';

export const taskSchema = z.object({
  listID: z.number(),
  taskID: z.number().optional(),
  taskName: z.string(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
  isActive: z.boolean().optional().default(true)
});

export type TaskType = z.infer<typeof taskSchema>;

interface ITask
  extends TaskType,
    Model<InferAttributes<ITask>, InferCreationAttributes<ITask>> {}

export class GetTaskModel {
  public readonly taskModel: ModelStatic<ITask>;
  constructor(pgDB: Sequelize) {
    this.taskModel = pgDB.define<ITask>(
      'TASK',
      {
        listID: {
          type: DataTypes.INTEGER,
          field: 'LIST_ID'
        },
        taskID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'TASK_ID'
        },
        taskName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'TASK_NAME'
        },
        description: {
          type: DataTypes.STRING,
          field: 'DESCRIPTION',
          defaultValue: ''
        },
        status: {
          type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'DONE'),
          field: 'STATUS',
          defaultValue: 'OPEN'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          field: 'IS_ACTIVE',
          defaultValue: true
        }
      },
      {
        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT',
        tableName: 'TASK'
      }
    );
  }
}

export const taskModel = new GetTaskModel(pgInstance).taskModel;
taskModel.belongsTo(listModel, {
  foreignKey: 'listID',
  as: 'list'
});
listModel.hasMany(taskModel, { as: 'tasks', foreignKey: 'listID' });
