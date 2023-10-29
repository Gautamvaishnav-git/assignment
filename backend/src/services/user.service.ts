import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserType } from '../model/user.model';
import { UserModel, userSchema } from '../model/user.model';
import type { SessionUser } from '../types/request';
import { getLoggerInstance } from './logger.service';

export class UserService {
  private readonly UserModel = UserModel;

  public async getAllUsers(): Promise<UserType[]> {
    try {
      const users = await this.UserModel.findAll();
      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public signUp = async (
    username: string,
    password: string,
    email: string
  ): Promise<UserType> => {
    try {
      const parsed = userSchema.parse({ username, password, email });
      const hashedPassword = this.hashPassword(password);
      const user = await this.UserModel.create({
        username: parsed.username,
        password: hashedPassword,
        email: parsed.email
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  public signIn = async (
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    try {
      const user = await this.UserModel.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = this.comparePassword(user.password, password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      if (!user.id) throw new Error('User id not found');

      const token = this.createToken<SessionUser>({
        email: user.email,
        userID: user.id
      });
      return { token };
    } catch (error) {
      getLoggerInstance(error);
      throw error;
    }
  };

  public createToken = <Payload extends object>(payload: Payload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET, {});
  };

  public verifyToken = <Res>(token: string): Res => {
    return jwt.verify(token, process.env.JWT_SECRET) as Res;
  };

  private readonly hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
  };

  private readonly comparePassword = (
    hashed: string,
    original: string
  ): boolean => {
    return bcrypt.compareSync(original, hashed);
  };
}
