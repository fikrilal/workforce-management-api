import { prisma } from '../../database';
import type { RefreshTokenRepository, RefreshToken } from '../../../domain/auth/refresh-token';

function toEntity(row: any): RefreshToken {
  return {
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    revokedAt: row.revokedAt ?? null,
    replacedById: row.replacedById ?? null
  };
}

export const refreshTokenRepositoryPrisma: RefreshTokenRepository = {
  async create(params) {
    const row = await prisma.refreshToken.create({
      data: {
        userId: params.userId,
        tokenHash: params.tokenHash,
        expiresAt: params.expiresAt
      }
    });
    return toEntity(row);
  },
  async findActiveByUserId(userId) {
    const rows = await prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } }
    });
    return rows.map(toEntity);
  },
  async findById(id) {
    const row = await prisma.refreshToken.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  },
  async revoke(id) {
    await prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  },
  async rotate(oldId, params) {
    return await prisma.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({
        data: {
          userId: params.userId,
          tokenHash: params.tokenHash,
          expiresAt: params.expiresAt
        }
      });
      await tx.refreshToken.update({ where: { id: oldId }, data: { revokedAt: new Date(), replacedById: created.id } });
      return toEntity(created);
    });
  }
};

