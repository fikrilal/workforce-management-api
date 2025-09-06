import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../auth/jwt';
import { UnauthorizedError } from '../errors/app-error';
import { prisma } from '../../infrastructure/database';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(new UnauthorizedError());
  const payload = verifyJwt<{ sub: string; email: string }>(token);
  if (!payload) return next(new UnauthorizedError());
  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true } });
  if (!user) return next(new UnauthorizedError());
  req.user = user;
  next();
}

