# Daily Task Feature TODO

- **scope**
  - employee-only daily stand-up flow.
  - employees manually create today’s plan; no auto generation.
  - plans locked after the day passes; read-only history.
  - attachments are url links only; no uploads handled.
  - unlimited tasks per day.

- **data model**
  - create prisma models: `TaskPlan`, `TaskEntry`, `TaskAttachmentLink`.
  - enforce unique `(userId, workDate)` on `TaskPlan`.
  - `TaskEntry` fields: `taskPlanId`, `title`, optional `description`, `status` enum (`PLANNED|IN_PROGRESS|DONE`), optional `completedAt`, integer `order`.
  - `TaskAttachmentLink` fields: `taskEntryId`, `label?`, `url`, optional `description`.
  - add migrations and regenerate prisma client.

- **backend modules**
  - add `src/modules/tasks/` with controller → service → repository.
  - repository handles prisma calls and conversions.
  - service rules: prevent creating plan for past dates; disallow edits for non-today plans; validate status transitions; clamp duplicate urls.
  - shared validators for date/tz handling.

- **http layer**
  - routes under `/api/tasks`.
  - `POST /api/tasks/plans` create today’s plan with task entries + attachments.
  - `PATCH /api/tasks/plans/:planId` update today’s plan metadata and replace task list (reject if not today).
  - `PATCH /api/tasks/entries/:entryId` update status/notes/order for today only.
  - `GET /api/tasks/plans/today` fetch active plan (404 if missing).
  - `GET /api/tasks/history?from=&to=` list past plans with pagination (read-only).
  - validation using `express-validator`; integrate with `authMiddleware`.

- **attachments**
  - accept array of link objects `{ url, label?, description? }`.
  - enforce https urls, length limits, and max attachments per task (configurable constant).

- **tests**
  - unit tests for service logic (one-plan-per-day, lock past updates, status flow).
  - integration tests covering create/update/history and attachment validation.
  - seed helper for creating users and plans.

- **docs**
  - update `docs/auth.md` if any auth changes (likely none).
  - add user guide for daily tasks workflow.
  - document new env/config constants if introduced.

- **follow-up questions**
  - timezone handling: assume UTC or need per-user timezone? (default to UTC unless specified).
  - should editing be allowed before the day ends (e.g., manual override)? currently assumed yes for current day.
