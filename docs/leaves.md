# Leaves Module

Base path: `/api/leaves` (JWT required)

## Create Leave
- POST `/api/leaves`
- Body:
```
{ "type": "ANNUAL", "startDate": "2025-09-10", "endDate": "2025-09-12", "reason": "family event" }
```
- Rules: start ≤ end; range 1–30 days; reason ≤ 500; overlaps rejected
- Response 201: `{ data: LeaveRequest }`
- Errors: 422 VALIDATION_ERROR, 409 LEAVE_OVERLAP

## Cancel Leave
- POST `/api/leaves/:id/cancel`
- Only when status = PENDING (owner only)
- Response 200: `{ data: LeaveRequest }`
- Errors: 404 NOT_FOUND, 403 FORBIDDEN, 409 CANNOT_CANCEL

## List Leaves
- GET `/api/leaves?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=20`
- Or: `month=YYYY-MM` or `year=YYYY`
- Filters: `type=ANNUAL|SICK|UNPAID|OTHER`, `status=PENDING|APPROVED|REJECTED|CANCELLED`
- Response 200:
```
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 20, "total": 3, "totalPages": 1 } }
```

Notes:
- Dates interpreted in UTC (inclusive).
- Overlap: cannot overlap existing PENDING/APPROVED requests.
