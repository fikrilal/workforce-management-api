# Attendance Module

Base path: `/api/attendance` (JWT required)

## Clock In
- POST `/api/attendance/clock-in`
- Body (optional):
```
{ "note": "starting my day", "method": "WEB" } // method: WEB | MOBILE | KIOSK
```
- Responses:
  - 201 Created:
```
{ "data": { "id": "uuid", "workDate": "2025-09-06T00:00:00.000Z", "clockInAt": "...", "clockOutAt": null, "minutesWorked": null, "note": "starting my day", "method": "WEB" } }
```
  - 409 SESSION_OPEN if an open session exists

## Clock Out
- POST `/api/attendance/clock-out`
- Response 200 OK:
```
{ "data": { "id": "uuid", "clockOutAt": "...", "minutesWorked": 5, ... } }
```
- Errors:
  - 409 NO_OPEN_SESSION if no open session

## List Sessions
- GET `/api/attendance?from=2025-01-01&to=2025-12-31&page=1&pageSize=20`
- Pagination: `page` (default 1), `pageSize` (default 20, max 100)
- Response 200 OK:
```
{
  "data": [ { "id": "uuid", "workDate": "...", "clockInAt": "...", "clockOutAt": "..." } ],
  "meta": { "page": 1, "pageSize": 20, "total": 42, "totalPages": 3 }
}
```

Notes:
- times are UTC; `workDate` is the UTC date bucket for reports.
- only one open session is allowed at a time.
