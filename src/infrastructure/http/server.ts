import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { router as apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';

export function createServer() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Basic global rate limiter
  const limiter = rateLimit({ windowMs: 60_000, max: 100 });
  app.use(limiter);

  app.use('/', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

