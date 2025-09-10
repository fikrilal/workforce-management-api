import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../auth/jwt';
import { UnauthorizedError } from '../errors/app-error';
import { ports } from '../../application/container';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const accessToken = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!accessToken) return next(new UnauthorizedError());
  const payload = verifyJwt<{ sub: string; email: string }>(accessToken);
  if (!payload) return next(new UnauthorizedError());
  const user = await ports.userRepo.findById(payload.sub);
  if (!user) return next(new UnauthorizedError());
  req.user = user;
  next();
}
