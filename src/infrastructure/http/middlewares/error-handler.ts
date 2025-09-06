import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/app-error';
import { logger } from '../../../shared/logger';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { message: 'Not Found' } });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { message: err.message, code: err.code }, meta: err.meta });
  }
  logger.error('Unhandled error', { err });
  return res.status(500).json({ error: { message: 'Internal Server Error' } });
}

