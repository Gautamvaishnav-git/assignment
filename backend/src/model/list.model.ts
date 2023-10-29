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
import { UserModel } from './user.model';

export const listSchema = z.object({
  listID: z.number().optional(),
  listName: z.string(),
  createdBy: z.number(),
  updatedBy: z.number()
});

export type ListType = z.infer<typeof listSchema>;

interface IList
  extends ListType,
    Model<InferAttributes<IList>, InferCreationAttributes<IList>> {}

export class GetListModel {
  public readonly listModel: ModelStatic<IList>;
  constructor(pgDB: Sequelize) {
    this.listModel = pgDB.define<IList>(
      'LIST',
      {
        listID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'LIST_ID'
        },
        listName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'LIST_NAME'
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'CREATED_BY'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'UPDATED_BY'
        }
      },
      {
        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT',
        tableName: 'LIST'
      }
    );
  }
}

export const listModel = new GetListModel(pgInstance).listModel;
listModel.belongsTo(UserModel, {
  foreignKey: 'CREATED_BY',
  as: 'createdByUser'
});
listModel.belongsTo(UserModel, {
  foreignKey: 'UPDATED_BY',
  as: 'updatedByUser'
});
