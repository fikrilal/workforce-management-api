# Refresh Tokens

- access tokens are short-lived jwt returned in the response body as `data.accessToken`.
- refresh tokens are opaque strings, stored hashed in the database and delivered via an httpOnly cookie, and also returned in the body as `data.refreshToken` for non-browser clients.

endpoints:
- `POST /api/auth/refresh` — reads the refresh cookie, rotates the token, sets a new cookie, and returns a new access token plus user.
- `POST /api/auth/logout` — revokes the current refresh token and clears the cookie.

example responses

register/login 201/200
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
    "user": { "id": "...", "email": "...", "fullName": "..." }
  }
}
```

refresh 200
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

cookie:
- name: `REFRESH_COOKIE_NAME` (default `refresh_token`)
- flags: httpOnly, sameSite=lax, secure in non-development
- max-age: `REFRESH_TOKEN_TTL_DAYS` (default 30 days)

env vars:
- `REFRESH_TOKEN_TTL_DAYS=30`
- `REFRESH_COOKIE_NAME=refresh_token`

security notes:
- tokens are rotated on every refresh; old tokens are revoked (replay protection).
- only token hashes are stored; raw tokens are never persisted.
