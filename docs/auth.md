# Auth Module

Base path: `/api/auth`

Conventions:
- headers: `Content-Type: application/json`
- auth: only `/api/auth/*` is public; other modules require `Authorization: Bearer <accessToken>`
- success shape: `{ data, meta? }`; error shape: `{ error: { message, code? }, meta? }`

## Register
- POST `/api/auth/register`

Request
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123",
  "fullName": "Jane Doe"
}
```

Response 201 (also sets `Set-Cookie: refresh_token=...; HttpOnly; ...`)
```
{
  "data": {
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<refreshTokenId>.<opaque>",
      "tokenType": "Bearer",
      "expiresIn": 900,
      "refreshExpiresIn": 2592000
    },
    "user": {
      "id": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
      "email": "jane@example.com",
      "fullName": "Jane Doe"
    }
  }
}
```

Validation errors
```
HTTP/1.1 422 Unprocessable Entity
{
  "error": { "message": "Validation error", "code": "VALIDATION_ERROR" },
  "meta": { "errors": [ { "field": "email", "message": "Invalid value" } ] }
}
```

Conflict (email taken)
```
HTTP/1.1 409 Conflict
{ "error": { "message": "Email already in use", "code": "EMAIL_TAKEN" } }
```

## Login
- POST `/api/auth/login`

Request
```
POST /api/auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "password123" }
```

Response 200 (also sets `Set-Cookie: refresh_token=...; HttpOnly; ...`)
```
{
  "data": {
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<refreshTokenId>.<opaque>",
      "tokenType": "Bearer",
      "expiresIn": 900,
      "refreshExpiresIn": 2592000
    },
    "user": {
      "id": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
      "email": "jane@example.com",
      "fullName": "Jane Doe"
    }
  }
}
```

Unauthorized
```
HTTP/1.1 401 Unauthorized
{ "error": { "message": "Invalid credentials", "code": "UNAUTHORIZED" } }
```

## Refresh
- POST `/api/auth/refresh`

Response 200 (rotates cookie and returns new tokens)
```
{
  "data": {
    "tokens": {
      "accessToken": "<new-jwt>",
      "refreshToken": "<newRefreshTokenId>.<opaque>",
      "tokenType": "Bearer",
      "expiresIn": 900,
      "refreshExpiresIn": 2592000
    },
    "user": { "id": "...", "email": "...", "fullName": "..." }
  }
}
```

## Logout
- POST `/api/auth/logout`

Response 200 (clears cookie)
```
{ "data": { "success": true } }
```

## Me
- GET `/api/auth/me`

Request
```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

Response 200
```
{
  "data": {
    "id": "e9b1b3a4-9e1d-4f5b-9c31-1b5f4d3c2a1e",
    "email": "jane@example.com",
    "fullName": "Jane Doe"
  }
}
```

Unauthorized
```
HTTP/1.1 401 Unauthorized
{ "error": { "message": "Unauthorized", "code": "UNAUTHORIZED" } }
```
