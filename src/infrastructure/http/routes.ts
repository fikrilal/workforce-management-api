import { Router } from 'express';
import { healthRouter } from '../../modules/health/health.routes';
import { authRouter } from '../../modules/auth/auth.routes';
import { usersRouter } from '../../modules/users/users.routes';

export const router = Router();

router.use('/health', healthRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);

router.get('/', (_req, res) => {
  res.json({ data: { name: 'workforce-management-api', status: 'ok' } });
});

