import { prisma } from '../../database';
import type { UserRepository } from '../../../domain/user/user.repository';
import type { User, UserCreateInput, UserWithPassword } from '../../../domain/user/user';

function toUser(row: any): User {
  return { id: row.id, email: row.email, fullName: row.fullName };
}

export const userRepositoryPrisma: UserRepository = {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    if (!row) return null;
    return { ...toUser(row), passwordHash: row.passwordHash };
  },
  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : null;
  },
  async create(data: UserCreateInput): Promise<User> {
    const row = await prisma.user.create({
      data: { email: data.email, passwordHash: data.passwordHash, fullName: data.fullName }
    });
    return toUser(row);
  }
};

