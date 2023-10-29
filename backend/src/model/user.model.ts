import type {
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize
} from 'sequelize';
import { DataTypes } from 'sequelize';
import z from 'zod';
import pgInstance from '../db/pg.db';

export const userSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  email: z.string().email(),
  password: z.string()
});

export type UserType = z.infer<typeof userSchema>;

export interface IUserModel
  extends UserType,
    Model<InferAttributes<IUserModel>, InferCreationAttributes<IUserModel>> {}

export class GetUserModel {
  public readonly UserModel: ModelStatic<IUserModel>;

  constructor(dbInstance: Sequelize) {
    this.UserModel = dbInstance.define<IUserModel>(
      'USER',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING }
      },
      {
        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT',
        tableName: 'USER'
      }
    );
  }
}

export const UserModel = new GetUserModel(pgInstance).UserModel;
