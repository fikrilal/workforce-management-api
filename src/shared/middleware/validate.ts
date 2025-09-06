import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { AppError } from '../errors/app-error';

export const validate = (chains: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(chains.map((c) => c.run(req)));
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    const errors = result
      .array()
      .map((e: any) => ({ field: e.path ?? e.param, message: e.msg }));
    next(new AppError('Validation error', 422, 'VALIDATION_ERROR', { errors }));
  };
};
