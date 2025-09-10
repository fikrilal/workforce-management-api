# Payslips Module

Base path: `/api/payslips` (JWT required)

Conventions:
- headers: `Authorization: Bearer <accessToken>`
- decimals (gross/net) are serialized as strings in JSON

Entity shape
```
{
  "id": "uuid",
  "userId": "uuid",
  "year": 2025,
  "month": 9,
  "currency": "USD",
  "gross": "1000.00",
  "net": "800.00",
  "items": { "bonus": 100 } | null,
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

## List Payslips
- GET `/api/payslips`

Query options
```
year=YYYY (optional)
month=1..12 (optional)
page=1..N (default 1)
pageSize=1..100 (default 20)
```

Request
```
GET /api/payslips?year=2025&month=9&page=1&pageSize=20
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": [
    {
      "id": "6a2f7c9e-4e0d-4010-9d1e-2f3f5b7a9c0d",
      "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
      "year": 2025,
      "month": 9,
      "currency": "USD",
      "gross": "1000.00",
      "net": "800.00",
      "items": { "bonus": 100 },
      "createdAt": "2025-09-07T09:03:00.000Z",
      "updatedAt": "2025-09-07T09:03:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }
}
```

## Get Payslip By Period
- GET `/api/payslips/:year/:month`

Request
```
GET /api/payslips/2025/9
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": {
    "id": "6a2f7c9e-4e0d-4010-9d1e-2f3f5b7a9c0d",
    "userId": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "year": 2025,
    "month": 9,
    "currency": "USD",
    "gross": "1000.00",
    "net": "800.00",
    "items": { "bonus": 100 },
    "createdAt": "2025-09-07T09:03:00.000Z",
    "updatedAt": "2025-09-07T09:03:00.000Z"
  }
}
```

Not found
```
HTTP/1.1 404 Not Found
{ "error": { "message": "Payslip not found", "code": "NOT_FOUND" } }
```

Notes
- one payslip per (userId, year, month)
- currency is a string (e.g., "USD")
