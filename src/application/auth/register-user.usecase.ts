import type { UserRepository } from '../../domain/user/user.repository';
import { Password } from '../../shared/auth/password';
import { signJwt } from '../../shared/auth/jwt';
import { AppError } from '../../shared/errors/app-error';

export type RegisterUserInput = { email: string; password: string; fullName?: string };

export function makeRegisterUser(repo: UserRepository) {
  return {
    async execute(input: RegisterUserInput) {
      const existing = await repo.findByEmail(input.email);
      if (existing) throw new AppError('Email already in use', 409, 'EMAIL_TAKEN');
      const passwordHash = await Password.hash(input.password);
      const user = await repo.create({ email: input.email, passwordHash, fullName: input.fullName });
      const accessToken = signJwt({ sub: user.id, email: user.email });
      return { accessToken, user };
    }
  };
}
