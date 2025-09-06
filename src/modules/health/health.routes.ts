import { Router } from 'express';
import { ResponseUtils } from '../../shared/utils/response-utils';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  return ResponseUtils.ok(res, {
    health: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

