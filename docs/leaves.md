# Leaves Module

Base path: `/api/leaves` (JWT required)

Conventions:
- headers: `Authorization: Bearer <accessToken>` and `Content-Type: application/json`
- dates are UTC and inclusive
- success shape includes full leave entity

Entity shape
```
{
  "id": "uuid",
  "userId": "uuid",
  "type": "ANNUAL|SICK|UNPAID|OTHER",
  "startDate": "ISO",
  "endDate": "ISO",
  "totalDays": 1,
  "reason": "string|null",
  "status": "PENDING|APPROVED|REJECTED|CANCELLED",
  "decidedAt": "ISO|null",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

## Create Leave
- POST `/api/leaves`

Request
```
POST /api/leaves
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "ANNUAL",
  "startDate": "2025-09-10",
  "endDate": "2025-09-12",
  "reason": "family event"
}
```

Response 201
```
{
  "data": {
    "id": "2c3f8c4b-0a5c-42ab-bf36-e5a0d1b9a1f2",
    "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "type": "ANNUAL",
    "startDate": "2025-09-10T00:00:00.000Z",
    "endDate": "2025-09-12T00:00:00.000Z",
    "totalDays": 3,
    "reason": "family event",
    "status": "PENDING",
    "decidedAt": null,
    "createdAt": "2025-09-07T09:02:00.000Z",
    "updatedAt": "2025-09-07T09:02:00.000Z"
  }
}
```

Validation errors
```
HTTP/1.1 422 Unprocessable Entity
{ "error": { "message": "Validation error", "code": "VALIDATION_ERROR" } }
```

Overlap error
```
HTTP/1.1 409 Conflict
{ "error": { "message": "Overlapping leave request", "code": "LEAVE_OVERLAP" } }
```

## Cancel Leave
- POST `/api/leaves/:id/cancel`

Request
```
POST /api/leaves/2c3f8c4b-0a5c-42ab-bf36-e5a0d1b9a1f2/cancel
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": {
    "id": "2c3f8c4b-0a5c-42ab-bf36-e5a0d1b9a1f2",
    "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "type": "ANNUAL",
    "startDate": "2025-09-10T00:00:00.000Z",
    "endDate": "2025-09-12T00:00:00.000Z",
    "totalDays": 3,
    "reason": "family event",
    "status": "CANCELLED",
    "decidedAt": "2025-09-07T10:00:00.000Z",
    "createdAt": "2025-09-07T09:02:00.000Z",
    "updatedAt": "2025-09-07T10:00:00.000Z"
  }
}
```

Not found / forbidden / cannot cancel
```
HTTP/1.1 404 Not Found
{ "error": { "message": "Leave not found", "code": "NOT_FOUND" } }

HTTP/1.1 403 Forbidden
{ "error": { "message": "Not your leave request", "code": "FORBIDDEN" } }

HTTP/1.1 409 Conflict
{ "error": { "message": "Cannot cancel this request", "code": "CANNOT_CANCEL" } }
```

## List Leaves
- GET `/api/leaves`

Query options
```
from=YYYY-MM-DD
to=YYYY-MM-DD
month=YYYY-MM
year=YYYY
type=ANNUAL|SICK|UNPAID|OTHER
status=PENDING|APPROVED|REJECTED|CANCELLED
page=1..N (default 1)
pageSize=1..100 (default 20)
```

Request
```
GET /api/leaves?month=2025-09&type=ANNUAL&status=PENDING&page=1&pageSize=20
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": [
    {
      "id": "2c3f8c4b-0a5c-42ab-bf36-e5a0d1b9a1f2",
      "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
      "type": "ANNUAL",
      "startDate": "2025-09-10T00:00:00.000Z",
      "endDate": "2025-09-12T00:00:00.000Z",
      "totalDays": 3,
      "reason": "family event",
      "status": "PENDING",
      "decidedAt": null,
      "createdAt": "2025-09-07T09:02:00.000Z",
      "updatedAt": "2025-09-07T09:02:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }
}
```

Notes
- dates are interpreted in UTC (inclusive)
- overlapping requests with PENDING/APPROVED are rejected
