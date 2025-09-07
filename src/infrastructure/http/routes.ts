import { Router } from 'express';
import { healthRouter } from '../../modules/health/health.routes';
import { authRouter } from '../../modules/auth/auth.routes';
import { usersRouter } from '../../modules/users/users.routes';
import { attendanceRouter } from '../../modules/attendance/attendance.routes';
import { leavesRouter } from '../../modules/leaves/leaves.routes';
import { payslipsRouter } from '../../modules/payslips/payslips.routes';

export const router = Router();

router.use('/health', healthRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);
router.use('/api/attendance', attendanceRouter);
router.use('/api/leaves', leavesRouter);
router.use('/api/payslips', payslipsRouter);

router.get('/', (_req, res) => {
  res.json({ data: { name: 'workforce-management-api', status: 'ok' } });
});
