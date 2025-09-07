import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ResponseUtils } from '../../shared/utils/response-utils';

async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body as {
    email: string;
    password: string;
    fullName?: string;
  };
  const result = await authService.register({ email, password, fullName });
  return ResponseUtils.created(res, result);
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.login({ email, password });
  return ResponseUtils.ok(res, result);
}

async function me(req: Request, res: Response) {
  const user = await authService.me(req.user!.id);
  return ResponseUtils.ok(res, user);
}

export const authController = { register, login, me };
