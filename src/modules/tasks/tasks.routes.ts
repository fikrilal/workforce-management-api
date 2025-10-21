import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authMiddleware } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { tasksController } from './tasks.controller';

export const tasksRouter = Router();

const taskStatuses = ['PLANNED', 'IN_PROGRESS', 'DONE'];

tasksRouter.use(authMiddleware);

const taskValidators = [
  body('summary').optional().isString().isLength({ max: 500 }),
  body('tasks').isArray({ min: 1, max: 50 }),
  body('tasks.*.title').isString().isLength({ min: 1, max: 200 }),
  body('tasks.*.description').optional().isString().isLength({ max: 2000 }),
  body('tasks.*.status')
    .optional()
    .isString()
    .custom((value) => taskStatuses.includes(value.toUpperCase())),
  body('tasks.*.order').optional().isInt({ min: 0, max: 1000 }),
  body('tasks.*.attachments').optional().isArray({ max: 5 }),
  body('tasks.*.attachments.*.url').optional().isString().isLength({ min: 1, max: 2000 }),
  body('tasks.*.attachments.*.label').optional().isString().isLength({ max: 120 }),
  body('tasks.*.attachments.*.description').optional().isString().isLength({ max: 500 })
];

tasksRouter.post('/plans', validate(taskValidators), tasksController.createPlan);

tasksRouter.patch(
  '/plans/:planId',
  validate([param('planId').isUUID(), ...taskValidators]),
  tasksController.updatePlan
);

tasksRouter.get('/plans/today', tasksController.getTodayPlan);

tasksRouter.get(
  '/history',
  validate([
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 50 })
  ]),
  tasksController.listHistory
);
