import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth';
import { usersController } from './users.controller';

export const usersRouter = Router();

usersRouter.get('/me', authMiddleware, usersController.me);

