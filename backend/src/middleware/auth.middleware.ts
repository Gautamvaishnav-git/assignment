import type { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import type { SessionUser } from '../types/request';
import { getLoggerInstance } from '../services/logger.service';

class AuthMiddleware {
  private readonly userService = new UserService();
  verifyToken = (req: Request, res: Response, next: NextFunction): unknown => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const verified = this.userService.verifyToken<SessionUser>(token);
      if (!verified) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.body.user = verified;

      next();
    } catch (error) {
      const { message, statusCode } = getLoggerInstance(error);
      return res.status(statusCode).json({ message });
    }
  };
}

export default new AuthMiddleware();
