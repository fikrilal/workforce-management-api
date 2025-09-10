import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from './auth.controller';
import { validate } from '../../shared/middleware/validate';
import { authMiddleware } from '../../shared/middleware/auth';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate([
    body('email').isEmail(),
    body('password').isString().isLength({ min: 8 }),
    body('fullName').optional().isString()
  ]),
  authController.register
);

authRouter.post(
  '/login',
  validate([body('email').isEmail(), body('password').isString().isLength({ min: 8 })]),
  authController.login
);

authRouter.get('/me', authMiddleware, authController.me);

authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
