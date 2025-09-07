import type { UserRepository } from '../../domain/user/user.repository';
import { AppError } from '../../shared/errors/app-error';

export function makeGetMe(repo: UserRepository) {
  return {
    async execute(userId: string) {
      const user = await repo.findById(userId);
      if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      return user;
    }
  };
}

