# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/`
  - Entrypoints: `src/index.ts`, `src/app.ts`
  - HTTP: `src/infrastructure/http/` (Express server, middleware, routes)
  - DB: `src/infrastructure/database/` (Prisma client)
  - Modules: `src/modules/{health,auth,users}/` (controller → service → repository pattern)
  - Shared: `src/shared/` (auth utils, middleware, logger, errors, utils)
- Tests: colocated as `*.test.ts` under `src/**`
- Prisma schema: `prisma/schema.prisma`
- Config: `.env` (copy from `.env.example`)

## Build, Test, and Development Commands

- `npm run dev` — Start in watch mode (Express + TS via tsx)
- `npm run build` — TypeScript compile to `dist/`
- `npm start` — Run compiled app from `dist/`
- `npm test` — Jest tests (ts-jest + supertest)
- `npm run test:coverage` — Coverage report
- `npm run lint` — ESLint TypeScript checks
- `npx prisma generate` — Generate Prisma client
- `npx prisma migrate dev` — Apply dev migrations

## Coding Style & Naming Conventions

- TypeScript strict; avoid `any`.
- 2-space indentation; semicolons on; single quotes preferred.
- File names: kebab-case (e.g., `users.controller.ts`).
- Structure: controllers delegate to services; repositories are the only DB callers.
- Responses via `ResponseUtils`; consistent JSON shape `{ data, meta | error }`.
- Linting: ESLint with `@typescript-eslint`.

## Testing Guidelines

- Frameworks: Jest + ts-jest + supertest.
- Test files: `*.test.ts` near source (e.g., `health.test.ts`).
- Aim for meaningful coverage; target ≥80% lines for changed code.
- Prefer fast unit tests; integration uses the Express app without binding a port.

## Commit & Pull Request Guidelines

- Commit messages: Conventional Commits recommended (e.g., `feat(auth): add login route`).
- Keep commits focused and atomic; include tests when fixing bugs.
- PRs: clear description, link issues, include steps to test, and screenshots/logs when relevant.

## Security & Configuration Tips

- Never commit secrets; use `.env` (ignored). Set a strong `JWT_SECRET` in non-dev.
- Run rate limiting is enabled globally; tune limits per route as needed.
- Validate inputs with `express-validator`; return 422 on validation errors.

## Agent-Specific Instructions

- Follow module boundaries; do not place DB calls in controllers.
- Keep changes minimal and consistent with existing patterns.
- Update or add tests for all behavior changes.
- If you need to write comments, always use all small case.
