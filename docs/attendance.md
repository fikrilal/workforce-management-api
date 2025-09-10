# Attendance Module

Base path: `/api/attendance` (JWT required)

Conventions:
- headers: `Authorization: Bearer <accessToken>` and `Content-Type: application/json`
- `method`: one of `WEB`, `MOBILE`, `KIOSK`
- times are UTC; `workDate` represents the UTC date bucket

## Clock In

- POST `/api/attendance/clock-in`

Request (all fields optional)
```
POST /api/attendance/clock-in
Authorization: Bearer <accessToken>
Content-Type: application/json

{ "note": "starting my day", "method": "WEB" }
```

Response 201
```
{
  "data": {
    "id": "4b8f3e1e-66b9-4b7e-97a0-1f3a3f5c8a0b",
    "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "workDate": "2025-09-07T00:00:00.000Z",
    "clockInAt": "2025-09-07T09:01:00.000Z",
    "clockOutAt": null,
    "minutesWorked": null,
    "note": "starting my day",
    "method": "WEB"
  }
}
```

Conflict (open session exists)
```
HTTP/1.1 409 Conflict
{ "error": { "message": "Session already open", "code": "SESSION_OPEN" } }
```

Validation errors
```
HTTP/1.1 422 Unprocessable Entity
{
  "error": { "message": "Validation error", "code": "VALIDATION_ERROR" },
  "meta": { "errors": [ { "field": "method", "message": "Invalid value" } ] }
}
```

## Clock Out

- POST `/api/attendance/clock-out`

Request
```
POST /api/attendance/clock-out
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": {
    "id": "4b8f3e1e-66b9-4b7e-97a0-1f3a3f5c8a0b",
    "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "workDate": "2025-09-07T00:00:00.000Z",
    "clockInAt": "2025-09-07T09:01:00.000Z",
    "clockOutAt": "2025-09-07T17:05:00.000Z",
    "minutesWorked": 484,
    "note": "starting my day",
    "method": "WEB"
  }
}
```

No open session
```
HTTP/1.1 409 Conflict
{ "error": { "message": "No open session", "code": "NO_OPEN_SESSION" } }
```

## List Sessions

- GET `/api/attendance`

Query options (use either from/to, or month, or year)
```
from=YYYY-MM-DD (ISO date)
to=YYYY-MM-DD (ISO date)
month=YYYY-MM
year=YYYY
method=WEB|MOBILE|KIOSK
status=open|closed
page=1..N (default 1)
pageSize=1..100 (default 20)
```

Request
```
GET /api/attendance?month=2025-09&method=WEB&status=closed&page=1&pageSize=20
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": [
    {
      "id": "4b8f3e1e-66b9-4b7e-97a0-1f3a3f5c8a0b",
      "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
      "workDate": "2025-09-07T00:00:00.000Z",
      "clockInAt": "2025-09-07T09:01:00.000Z",
      "clockOutAt": "2025-09-07T17:05:00.000Z",
      "minutesWorked": 484,
      "note": "starting my day",
      "method": "WEB"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }
}
```
