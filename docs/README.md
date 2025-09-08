# API Documentation

This project provides a minimal workforce management API. Start the server with `npm run dev` and a Postgres DB via `npm run db:up`.

Base
- base url: `http://localhost:3000`
- root: `GET /` → `{ data: { name, status } }`
- health: `GET /health` → `{ data: { health, environment, timestamp } }`

Conventions
- headers: `Content-Type: application/json`
- auth: JWT bearer required for all `/api/*` except `/api/auth/*`
- success shape: `{ data, meta? }`
- error shape: `{ error: { message, code? }, meta? }`
- validation: 422 with `meta.errors: [{ field, message }]`

Modules
- Auth: see `docs/auth.md`
- Attendance: see `docs/attendance.md`
- Leaves: see `docs/leaves.md`
- Payslips: see `docs/payslips.md`
- Deployment: see `docs/DEPLOYMENT.md`

Environment
- configure `.env` from `.env.example` (ensure `DATABASE_URL` and `JWT_SECRET`)
