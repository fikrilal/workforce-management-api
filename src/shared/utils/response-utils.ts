import { Response } from 'express';

export const ResponseUtils = {
  ok<T>(res: Response, data: T, meta?: Record<string, unknown>) {
    return res.status(200).json({ data, meta });
  },
  created<T>(res: Response, data: T, meta?: Record<string, unknown>) {
    return res.status(201).json({ data, meta });
  }
};

