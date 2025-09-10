import { useCases } from '../../application/container';

type RegisterInput = { email: string; password: string; fullName?: string };

async function register(input: RegisterInput) {
  const { user, accessToken } = await useCases.registerUser.execute(input);
  const refresh = await useCases.issueRefresh.execute(user.id);
  return { accessToken, user, refreshToken: `${refresh.id}.${refresh.raw}` };
}

async function login(input: { email: string; password: string }) {
  const result = await useCases.loginUser.execute(input);
  const refresh = await useCases.issueRefresh.execute(result.user.id);
  return { ...result, refreshToken: `${refresh.id}.${refresh.raw}` };
}

async function me(userId: string) {
  return useCases.getMe.execute(userId);
}

async function refreshSession(tokenId: string, rawToken: string) {
  return useCases.refreshSession.execute({ currentTokenId: tokenId, rawToken });
}

async function logout(tokenId: string | null | undefined) {
  return useCases.logout.execute(tokenId);
}

export const authService = { register, login, me, refreshSession, logout };
