# Backend Starter (Express + Prisma)

A lightweight Node.js/TypeScript backend starter that mirrors this repo’s architecture, focused on a smaller scope: JWT auth only (no Google OAuth), PostgreSQL via Prisma, and email via Sender.

## Tech Stack

- Runtime: Node.js ≥ 20, TypeScript
- HTTP: Express 5, Helmet, express-rate-limit
- Auth: JWT (jsonwebtoken) — no OAuth providers
- DB/ORM: Prisma + PostgreSQL

- Validation: class-validator, express-validator
- Logging: Winston (JSON logs)
- Email: Sender (SDK or REST API)

- Testing: Jest + ts-jest + Supertest
- Tooling: ESLint (@typescript-eslint), ts-node-dev, tsx, cross-env

## Project Structure

```
src/
  index.ts                 # Process entrypoint
  app.ts                   # App bootstrap (db/server)
 config/                  # Dotenv loader and typed config
  infrastructure/
    http/
      server.ts            # Express app, middleware, routes, errors
      middlewares/         # error handler, rate limits, etc.
    database/
      prisma/
        client.ts          # Prisma client singleton
      index.ts             # Database service wrapper
   email/                 # Sender email service
  modules/
    auth/                  # Auth routes/controller/service/repository
    users/                 # Users CRUD/profile
    health/                # Health endpoint module
  shared/
    auth/                  # jwt utils, password utils
    middleware/            # auth, validate, permissions, rate-limit
    utils/                 # ResponseUtils, misc helpers
    logger/                # Winston logger
    errors/                # AppError hierarchy
    test-helpers/          # Mocks and helpers for tests
 test-setup.ts            # Jest setup
 types/
prisma/
  schema.prisma            # DB schema + migrations
docs/
  ARCHITECTURE.md          # This document, design notes
```

Conventions:

- Module layout: controller → service → repository. No DB calls in controllers.
- File naming: kebab-case. Tests colocated as `*.test.ts`.
- HTTP responses via `ResponseUtils`, pagination/metadata under `meta`.

## Quick Start

- Prerequisites:
  - Node.js ≥ 20
  - PostgreSQL (`DATABASE_URL`)
- Setup:
  - Copy env: `cp .env.example .env` and fill values
  - Install deps: `npm install`
  - Generate Prisma client: `npx prisma generate`
  - Dev migration: `npx prisma migrate dev`
- Run:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Start: `npm start`
  - Health: `GET /health` → `{ health: "ok", version, environment }`
- Quality:
  - Tests: `npm test` | `npm run test:watch` | `npm run test:coverage`
  - Lint: `npm run lint`

## Scripts

- `npm run dev` — ts-node-dev watch mode
- `npm run build` — compile to `dist/`
- `npm start` — run `dist/index.js`
- `npm test` — Jest tests

## Environment Variables

Required:

- `DATABASE_URL` — PostgreSQL connection string

Recommended:

- `JWT_SECRET` — Strong secret in production
- `PORT` — Server port (default 3000)

Optional/Feature:

- Sender Email: `SENDER_API_KEY`, `FROM_EMAIL`, `FROM_NAME`, `FRONTEND_URL`

Example `.env.example`:

```
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://user:pass@localhost:5432/appdb

JWT_SECRET=dev_jwt_secret_change_in_production_2025

FRONTEND_URL=http://localhost:3000

# Email (Sender)
SENDER_API_KEY=
FROM_EMAIL=noreply@example.com
FROM_NAME=AppName
```

## HTTP Layer

- Express 5 app under `infrastructure/http/server.ts`
- Middleware: Helmet, JSON/urlencoded parsers
- Auth: JWT middleware for protected routes (no Passport/OAuth)
- Error handling: central `errorHandler`, 404 fallback, consistent JSON via `ResponseUtils`
- Rate limiting: global/per-route with express-rate-limit

Health endpoint:

- `GET /health` returns `{ health: "ok", version, environment, timestamp }`

## Auth

- JWT: short-lived access token + long-lived refresh token (implemented)
- Utilities: `shared/auth/jwt.ts` (sign/verify), `shared/auth/refresh.ts` (opaque token + cookies)
- Passwords: `shared/auth/password.ts` (hash/verify)
- Routes:
  - `POST /api/auth/register`, `POST /api/auth/login`
  - `POST /api/auth/refresh` — rotate refresh cookie, return new tokens
  - `POST /api/auth/logout` — revoke refresh token and clear cookie
  - `GET /api/auth/me` (JWT required)

## Database (Prisma + PostgreSQL)

- Client singleton: `infrastructure/database/prisma/client.ts`
- Service wrapper: `infrastructure/database/index.ts` (transactions, typed access)
- Migrations in `prisma/migrations/`

Minimal schema example:

```prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String?
  displayName  String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Modules (Feature Slices)

- Per module: `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `dtos/` or `*.validation.ts`
- Start with:
  - `modules/health` → `/health`
  - `modules/auth` → register/login/me
  - `modules/users` → profile fetch/update

## Background Jobs

Not included in this starter. Add later only if/when needed.

## Email (Sender)

- Implement `infrastructure/email` using the Sender API/SDK
- Typical features: verification, password reset, notifications
- Requires `SENDER_API_KEY`, `FROM_EMAIL`, `FROM_NAME`

## Push Notifications

Not included in this starter.

## Testing

- Jest + ts-jest, Node test environment
- Colocate tests as `*.test.ts`
- Supertest for HTTP integration (use Express app without binding a port)

Example test:

```ts
import request from "supertest";
import { createServer } from "../../infrastructure/http/server";

describe("Health", () => {
  it("returns ok", async () => {
    const app = createServer();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.data.health).toBe("ok");
  });
});
```

## Linting & Code Style

- ESLint with @typescript-eslint
- TypeScript strict mode; avoid `any`; explicit DTOs and Prisma types
- Run `npm run lint` before pushing

## Deployment

- Build with `npm run build`, run with `npm start`
- Provide at least `DATABASE_URL` and strong `JWT_SECRET`
- Expose `/health` for probes
- Configure `LOG_LEVEL` and process manager (PM2/Docker) as needed

## Growth Path

- Phase 1: Users + Auth + Health
- Phase 2: Email verification and password reset (Sender)
- Phase 3: Domain modules (as your product evolves)

## Validation Checklist

- [ ] `DATABASE_URL` configured; `prisma generate` and `migrate` run
- [ ] `JWT_SECRET` set (strong) in non-dev environments
- [ ] Optional services configured only when used (Sender email)
- [ ] Tests pass locally (`npm run test:coverage`)
