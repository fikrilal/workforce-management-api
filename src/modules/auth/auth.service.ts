import { useCases } from '../../application/container';

type RegisterInput = { email: string; password: string; fullName?: string };

async function register(input: RegisterInput) {
  return useCases.registerUser.execute(input);
}

async function login(input: { email: string; password: string }) {
  return useCases.loginUser.execute(input);
}

async function me(userId: string) {
  return useCases.getMe.execute(userId);
}

export const authService = { register, login, me };
