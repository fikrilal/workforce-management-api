import { createServer } from './infrastructure/http/server';
import { config } from './config';
import { logger } from './shared/logger';

export async function startApp() {
  const app = createServer();
  const port = config.PORT;

  const server = app.listen(port, () => {
    logger.info('Server started', { port, env: config.NODE_ENV });
  });

  const shutdown = () => {
    logger.info('Shutting down');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

