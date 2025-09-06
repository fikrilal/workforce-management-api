# Auth Module

Base path: `/api/auth`

## Register
- POST `/api/auth/register`
- Body:
```
{
  "email": "e@example.com",
  "password": "password123",
  "fullName": "Jane Doe"
}
```
- Response 201:
```
{
  "data": {
    "token": "<jwt>",
    "user": { "id": "uuid", "email": "e@example.com", "fullName": "Jane Doe" }
  }
}
```

## Login
- POST `/api/auth/login`
- Body:
```
{ "email": "e@example.com", "password": "password123" }
```
- Response 200: same shape as register.

## Me
- GET `/api/auth/me`
- Headers: `Authorization: Bearer <jwt>`
- Response 200:
```
{ "data": { "id": "uuid", "email": "e@example.com", "fullName": "Jane Doe" } }
```

## Errors
- 401 Unauthorized: `{ "error": { "code": "UNAUTHORIZED", "message": "Unauthorized" } }`
- 409 Email taken: `{ "error": { "code": "EMAIL_TAKEN", "message": "Email already in use" } }`
- 422 Validation: `{ "error": { "code": "VALIDATION_ERROR", ... } }`

