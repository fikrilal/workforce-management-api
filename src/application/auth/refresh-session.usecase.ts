import type { RefreshTokenRepository } from '../../domain/auth/refresh-token';
import { UnauthorizedError } from '../../shared/errors/app-error';
import { config } from '../../config';
import { generateRefreshToken, hashRefreshToken } from '../../shared/auth/refresh';
import argon2 from 'argon2';
import type { UserRepository } from '../../domain/user/user.repository';
import { signJwt } from '../../shared/auth/jwt';

export function makeRefreshSession(refreshRepo: RefreshTokenRepository, userRepo: UserRepository) {
  return {
    async execute(params: { currentTokenId: string; rawToken: string }) {
      const { currentTokenId, rawToken } = params;
      const stored = await refreshRepo.findById(currentTokenId);
      if (!stored) throw new UnauthorizedError();
      if (stored.revokedAt || stored.expiresAt <= new Date()) throw new UnauthorizedError();
      const match = await argon2.verify(stored.tokenHash, rawToken).catch(() => false);
      if (!match) throw new UnauthorizedError();

      // rotate
      const newRaw = generateRefreshToken();
      const newHash = await hashRefreshToken(newRaw);
      const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      const created = await refreshRepo.rotate(stored.id, { userId: stored.userId, tokenHash: newHash, expiresAt });

      const user = await userRepo.findById(stored.userId);
      if (!user) throw new UnauthorizedError();
      const accessToken = signJwt({ sub: user.id, email: user.email });

      return { accessToken, user, refreshToken: { id: created.id, raw: newRaw } };
    }
  };
}
