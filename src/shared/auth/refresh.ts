import crypto from 'crypto';
import argon2 from 'argon2';
import { Response } from 'express';
import { config } from '../../config';

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashRefreshToken(token: string) {
  return argon2.hash(token);
}

export function setRefreshCookie(res: Response, token: string) {
  const name = config.REFRESH_COOKIE_NAME;
  const maxAgeMs = config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
  const secure = config.NODE_ENV !== 'development';
  res.cookie(name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: maxAgeMs,
    path: '/'
  });
}

export function clearRefreshCookie(res: Response) {
  const name = config.REFRESH_COOKIE_NAME;
  const secure = config.NODE_ENV !== 'development';
  res.clearCookie(name, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
}

export function getRefreshCookie(req: { cookies?: Record<string, string | undefined> }) {
  return req.cookies?.[config.REFRESH_COOKIE_NAME];
}

