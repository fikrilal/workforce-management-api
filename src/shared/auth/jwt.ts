import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';

type JwtPayload = { sub: string; email: string } & Record<string, unknown>;

export function signJwt(payload: JwtPayload, options: SignOptions = { expiresIn: '15m' }) {
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function verifyJwt<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as unknown as T;
  } catch {
    return null;
  }
}
