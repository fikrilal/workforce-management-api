import { Router } from 'express';
import { ResponseUtils } from '../../shared/utils/response-utils';
// importing version from package.json for health endpoint
// note: json module imports are enabled via tsconfig `resolveJsonModule`
// in cjs runtime this becomes a require which works at runtime
import pkg from '../../../package.json';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  return ResponseUtils.ok(res, {
    health: 'ok',
    version: pkg.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});
