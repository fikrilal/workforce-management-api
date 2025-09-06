import { startApp } from './app';

startApp().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
