# Payslips Module

Base path: `/api/payslips` (JWT required)

## List Payslips
- GET `/api/payslips?year=2025&month=9&page=1&pageSize=20`
- Filters: `year` (int), `month` (1..12)
- Response:
```
{ "data": [ { "year": 2025, "month": 9, "currency": "USD", "gross": "...", "net": "..." } ], "meta": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 } }
```

## Get Payslip By Period
- GET `/api/payslips/:year/:month`
- Response 200: `{ data: Payslip }`
- Errors: 404 NOT_FOUND if not exists

Notes:
- One payslip per (userId, year, month).
- Currency is a string (e.g., "USD").
