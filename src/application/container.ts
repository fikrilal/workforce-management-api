import { userRepositoryPrisma } from '../infrastructure/prisma/repositories/user.repository.prisma';
import { makeRegisterUser } from './auth/register-user.usecase';
import { makeLoginUser } from './auth/login-user.usecase';
import { makeGetMe } from './auth/get-me.usecase';

// simple composition root for wiring dependencies
const userRepo = userRepositoryPrisma;

export const useCases = {
  registerUser: makeRegisterUser(userRepo),
  loginUser: makeLoginUser(userRepo),
  getMe: makeGetMe(userRepo)
};

export const ports = {
  userRepo
};

