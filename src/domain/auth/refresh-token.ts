export type RefreshToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedById: string | null;
};

export interface RefreshTokenRepository {
  create(params: { userId: string; tokenHash: string; expiresAt: Date }): Promise<RefreshToken>;
  findActiveByUserId(userId: string): Promise<RefreshToken[]>;
  findById(id: string): Promise<RefreshToken | null>;
  revoke(id: string): Promise<void>;
  rotate(oldId: string, params: { userId: string; tokenHash: string; expiresAt: Date }): Promise<RefreshToken>;
}

