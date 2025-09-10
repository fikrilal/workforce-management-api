import type { RefreshTokenRepository } from '../../domain/auth/refresh-token';
import { config } from '../../config';
import { generateRefreshToken, hashRefreshToken } from '../../shared/auth/refresh';

export function makeIssueRefreshToken(repo: RefreshTokenRepository) {
  return {
    async execute(userId: string) {
      const raw = generateRefreshToken();
      const tokenHash = await hashRefreshToken(raw);
      const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      const created = await repo.create({ userId, tokenHash, expiresAt });
      return { id: created.id, raw };
    }
  };
}
