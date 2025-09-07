import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { body, param, query } from 'express-validator';
import { LeaveTypes } from '../../domain/leave/leave-type';
import { LeaveStatuses } from '../../domain/leave/leave-status';
import { leavesController } from './leaves.controller';

export const leavesRouter = Router();

leavesRouter.use(authMiddleware);

leavesRouter.post(
  '/',
  validate([
    body('type').isIn(Array.from(LeaveTypes)),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('reason').optional().isString().isLength({ max: 500 })
  ]),
  leavesController.create
);

leavesRouter.post(
  '/:id/cancel',
  validate([param('id').isString().isLength({ min: 1 })]),
  leavesController.cancel
);

leavesRouter.get(
  '/',
  validate([
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('month').optional().matches(/^\d{4}-\d{2}$/),
    query('year').optional().isInt({ min: 1970, max: 3000 }),
    query('type').optional().isIn(Array.from(LeaveTypes)),
    query('status').optional().isIn(Array.from(LeaveStatuses)),
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 100 })
  ]),
  leavesController.list
);

