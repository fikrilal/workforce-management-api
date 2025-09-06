import { prisma } from '../../infrastructure/database';
import { Password } from '../../shared/auth/password';
import { signJwt } from '../../shared/auth/jwt';
import { AppError, UnauthorizedError } from '../../shared/errors/app-error';

type RegisterInput = { email: string; password: string; displayName?: string };

async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_TAKEN');
  }
  const passwordHash = await Password.hash(input.password);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, displayName: input.displayName }
  });
  const token = signJwt({ sub: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email, displayName: user.displayName } };
}

async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) throw new UnauthorizedError('Invalid credentials');
  const ok = await Password.verify(user.passwordHash, input.password);
  if (!ok) throw new UnauthorizedError('Invalid credentials');
  const token = signJwt({ sub: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email, displayName: user.displayName } };
}

async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, displayName: true } });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
}

export const authService = { register, login, me };

