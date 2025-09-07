# API Documentation

This project provides a minimal workforce management API. Start the server with `npm run dev` and a Postgres DB via `npm run db:up`.

- Base URL: `http://localhost:3000`
- Health: `GET /health`
- Auth: see `docs/auth.md`
- Attendance: see `docs/attendance.md`
- Leaves: see `docs/leaves.md`
- Payslips: see `docs/payslips.md`
- Deployment: see `docs/DEPLOYMENT.md`

Environment:
- Configure `.env` from `.env.example` (ensure `DATABASE_URL` and `JWT_SECRET`).
