import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ResponseUtils } from '../../shared/utils/response-utils';
import { setRefreshCookie, clearRefreshCookie, getRefreshCookie } from '../../shared/auth/refresh';
import { config } from '../../config';
import { UnauthorizedError } from '../../shared/errors/app-error';

async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body as {
    email: string;
    password: string;
    fullName?: string;
  };
  const result = await authService.register({ email, password, fullName });
  setRefreshCookie(res, result.refreshToken);
  const { accessToken, refreshToken, user } = result;
  const tokens = {
    accessToken,
    refreshToken,
    tokenType: 'Bearer' as const,
    expiresIn: 15 * 60, // 15 minutes in seconds
    refreshExpiresIn: config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60
  };
  return ResponseUtils.created(res, { tokens, user });
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.login({ email, password });
  setRefreshCookie(res, result.refreshToken);
  const { accessToken, refreshToken, user } = result;
  const tokens = {
    accessToken,
    refreshToken,
    tokenType: 'Bearer' as const,
    expiresIn: 15 * 60,
    refreshExpiresIn: config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60
  };
  return ResponseUtils.ok(res, { tokens, user });
}

async function me(req: Request, res: Response) {
  const user = await authService.me(req.user!.id);
  return ResponseUtils.ok(res, user);
}

async function refresh(req: Request, res: Response) {
  const cookie = getRefreshCookie(req);
  if (!cookie) throw new UnauthorizedError();
  // we store token id inside cookie? since opaque token isn't tied to id, we need id. embed id prefix
  const parts = cookie.split('.');
  if (parts.length !== 2) throw new UnauthorizedError();
  const [id, raw] = parts;
  const result = await authService.refreshSession(id, raw);
  const newRefresh = `${result.refreshToken.id}.${result.refreshToken.raw}`;
  setRefreshCookie(res, newRefresh);
  const tokens = {
    accessToken: result.accessToken,
    refreshToken: newRefresh,
    tokenType: 'Bearer' as const,
    expiresIn: 15 * 60,
    refreshExpiresIn: config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60
  };
  return ResponseUtils.ok(res, { tokens, user: result.user });
}

async function logout(req: Request, res: Response) {
  const cookie = getRefreshCookie(req);
  if (cookie) {
    const parts = cookie.split('.');
    if (parts.length === 2) {
      const [id] = parts;
      await authService.logout(id);
    }
  }
  clearRefreshCookie(res);
  return ResponseUtils.ok(res, { success: true });
}

export const authController = { register, login, me, refresh, logout };
