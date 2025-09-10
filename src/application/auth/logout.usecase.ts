import type { RefreshTokenRepository } from '../../domain/auth/refresh-token';

export function makeLogout(refreshRepo: RefreshTokenRepository) {
  return {
    async execute(tokenId: string | null | undefined) {
      if (!tokenId) return; // idempotent
      try {
        await refreshRepo.revoke(tokenId);
      } catch {
        // ignore errors for idempotency
      }
    }
  };
}

