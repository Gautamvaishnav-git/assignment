import type { Request } from 'express';

export interface SessionUser {
  userID: number;
  email: string;
}

export type RequestWithUser<
  ReqBody = unknown,
  P = Request['params'],
  ReqQuery = Request['query'],
  ResBody = unknown
> = Request<P, ResBody, { data: ReqBody } & { user: SessionUser }, ReqQuery>;
