import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database';
import { ResponseUtils } from '../../shared/utils/response-utils';

async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, email: true, displayName: true } });
  return ResponseUtils.ok(res, user);
}

export const usersController = { me };

