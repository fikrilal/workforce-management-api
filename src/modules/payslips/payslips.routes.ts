import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { query, param } from 'express-validator';
import { payslipsController } from './payslips.controller';

export const payslipsRouter = Router();

payslipsRouter.use(authMiddleware);

payslipsRouter.get(
  '/',
  validate([
    query('year').optional().isInt({ min: 1970, max: 3000 }),
    query('month').optional().isInt({ min: 1, max: 12 }),
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 100 })
  ]),
  payslipsController.list
);

payslipsRouter.get(
  '/:year/:month',
  validate([param('year').isInt({ min: 1970, max: 3000 }), param('month').isInt({ min: 1, max: 12 })]),
  payslipsController.getByPeriod
);

