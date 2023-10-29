import type { Request, Response } from 'express';
import type { UserType } from '../model/user.model';
import { getLoggerInstance } from '../services/logger.service';
import { UserService } from '../services/user.service';

class UserController {
  private readonly UserService = new UserService();

  signUp = async (
    req: Request<unknown, unknown, UserType>,
    res: Response
  ): Promise<Response> => {
    try {
      const user = await this.UserService.signUp(
        req.body.username,
        req.body.password,
        req.body.email
      );
      return res.status(201).json(user);
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };

  signIn = async (
    req: Request<unknown, unknown, UserType>,
    res: Response
  ): Promise<Response> => {
    try {
      const { token } = await this.UserService.signIn(
        req.body.email,
        req.body.password
      );
      return res.status(200).json({ token });
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };
}

export default new UserController();
