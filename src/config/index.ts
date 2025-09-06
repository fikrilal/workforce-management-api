import './loader';

function num(val: string | undefined, def: number) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: num(process.env.PORT, 3000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev_jwt_secret_change_in_production_2025',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  SENDER_API_KEY: process.env.SENDER_API_KEY ?? '',
  FROM_EMAIL: process.env.FROM_EMAIL ?? 'noreply@example.com',
  FROM_NAME: process.env.FROM_NAME ?? 'AppName'
} as const;
