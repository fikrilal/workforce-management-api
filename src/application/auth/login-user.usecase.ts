import type { UserRepository } from '../../domain/user/user.repository';
import { Password } from '../../shared/auth/password';
import { signJwt } from '../../shared/auth/jwt';
import { UnauthorizedError } from '../../shared/errors/app-error';

export type LoginUserInput = { email: string; password: string };

export function makeLoginUser(repo: UserRepository) {
  return {
    async execute(input: LoginUserInput) {
      const user = await repo.findByEmail(input.email);
      if (!user || !user.passwordHash) throw new UnauthorizedError('Invalid credentials');
      const ok = await Password.verify(user.passwordHash, input.password);
      if (!ok) throw new UnauthorizedError('Invalid credentials');
      const accessToken = signJwt({ sub: user.id, email: user.email });
      return { accessToken, user: { id: user.id, email: user.email, fullName: user.fullName } };
    }
  };
}
